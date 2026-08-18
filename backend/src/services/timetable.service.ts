import prisma from "../prisma";

type Slot = {
  dayId: string;
  periodId: number;
  dayIndex: number;
  periodIndex: number;
};

type Task = {
  id: string; 
  classId: string;
  teacherSubjectId: string;
  teacherId: string;
  subjectId: string;
  periodsPerWeek: number;
};

type Placement = Task & {
  dayId: string;
  periodId: number;
};

type GeneratedSchedule = {
  placements: Placement[];
  targetShortfall: number;
  targetExcess: number;
  freePeriods: number;
};

const MAX_ATTEMPTS = 300;

const key = (a: string, b: string) => `${a}::${b}`;

const shuffle = <T>(items: T[]): T[] => {
  const copy = [...items];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
};

const slotKey = (dayId: string, periodId: number) =>
  key(dayId, String(periodId));

const classSlotKey = (
  classId: string,
  dayId: string,
  periodId: number,
) => key(classId, slotKey(dayId, periodId));

const teacherSlotKey = (
  teacherId: string,
  dayId: string,
  periodId: number,
) => key(teacherId, slotKey(dayId, periodId));

const classSubjectDayKey = (
  classId: string,
  subjectId: string,
  dayId: string,
) => key(classId, key(subjectId, dayId));

/**
 * Calculates the number of empty periods inside a class's
 * daily occupied blocks.
 *
 * Example:
 *
 * P1 Math
 * P2 English
 * P3 FREE
 * P4 Physics
 *
 * => 1 internal gap.
 */
const calculateInternalGaps = (
  placements: Placement[],
  classId: string,
  days: { id: string }[],
  periods: { id: number; number: number }[],
) => {
  let gaps = 0;

  for (const day of days) {
    const indices = placements
      .filter(
        (placement) =>
          placement.classId === classId &&
          placement.dayId === day.id,
      )
      .map((placement) =>
        periods.findIndex(
          (period) => period.id === placement.periodId,
        ),
      )
      .filter((index) => index >= 0)
      .sort((a, b) => a - b);

    if (indices.length < 2) continue;

    const occupied = new Set(indices);

    for (let i = indices[0]; i <= indices[indices.length - 1]; i++) {
      if (!occupied.has(i)) {
        gaps++;
      }
    }
  }

  return gaps;
};

/**
 * Returns the number of slots available to a task.
 */
const getAvailableSlots = (
  task: Task,
  slots: Slot[],
  unavailable: Set<string>,
) => {
  return slots.filter(
    (slot) =>
      !unavailable.has(
        teacherSlotKey(task.teacherId, slot.dayId, slot.periodId),
      ),
  ).length;
};

/**
 * Scores a candidate placement.
 *
 * LOWER = BETTER
 */
const scoreCandidate = (
  placements: Placement[],
  task: Task,
  slot: Slot,
  days: { id: string }[],
  periods: { id: number; number: number }[],
) => {
  let score = 0;

  const classDayPlacements = placements.filter(
    (placement) =>
      placement.classId === task.classId &&
      placement.dayId === slot.dayId,
  );

  const subjectDayAlreadyUsed = placements.some(
    (placement) =>
      placement.classId === task.classId &&
      placement.subjectId === task.subjectId &&
      placement.dayId === slot.dayId,
  );

  /**
   * This should never normally happen because it is a HARD constraint,
   * but keep a huge penalty as a safety net.
   */
  if (subjectDayAlreadyUsed) {
    score += 1_000_000;
  }

  /**
   * Prefer days where this subject hasn't appeared yet.
   *
   * This naturally spreads subjects through the week.
   */
  const subjectDays = new Set(
    placements
      .filter(
        (placement) =>
          placement.classId === task.classId &&
          placement.subjectId === task.subjectId,
      )
      .map((placement) => placement.dayId),
  );

  if (subjectDays.has(slot.dayId)) {
    score += 500;
  } else {
    score -= 150;
  }

  /**
   * Prefer filling adjacent periods.
   */
  const occupiedIndices = classDayPlacements
    .map((placement) =>
      periods.findIndex(
        (period) => period.id === placement.periodId,
      ),
    )
    .filter((index) => index >= 0);

  if (occupiedIndices.length > 0) {
    const adjacent =
      occupiedIndices.includes(slot.periodIndex - 1) ||
      occupiedIndices.includes(slot.periodIndex + 1);

    if (adjacent) {
      score -= 120;
    }

    const min = Math.min(...occupiedIndices, slot.periodIndex);
    const max = Math.max(...occupiedIndices, slot.periodIndex);

    const span = max - min + 1;
    const occupiedCount = occupiedIndices.length + 1;

    score += (span - occupiedCount) * 100;
  }

  /**
   * Prefer not leaving a hole before/after this lesson.
   */
  if (slot.periodIndex > 0) {
    const previousPeriod = periods[slot.periodIndex - 1];

    if (
      previousPeriod &&
      !placements.some(
        (placement) =>
          placement.classId === task.classId &&
          placement.dayId === slot.dayId &&
          placement.periodId === previousPeriod.id,
      )
    ) {
      score += 15;
    }
  }

  /**
   * Slightly prefer teachers having compact days.
   */
  const teacherDayPlacements = placements.filter(
    (placement) =>
      placement.teacherId === task.teacherId &&
      placement.dayId === slot.dayId,
  );

  if (teacherDayPlacements.length > 0) {
    const teacherIndices = teacherDayPlacements
      .map((placement) =>
        periods.findIndex(
          (period) => period.id === placement.periodId,
        ),
      )
      .filter((index) => index >= 0);

    const min = Math.min(...teacherIndices, slot.periodIndex);
    const max = Math.max(...teacherIndices, slot.periodIndex);

    score += (max - min) * 2;
  }

  /**
   * Small randomness prevents every generation from being identical.
   */
  score += Math.random() * 10;

  return score;
};

/**
 * Determines whether a task can legally occupy a slot.
 *
 * IMPORTANT:
 *
 * Same subject twice on the same day is a HARD constraint.
 */
const canPlaceTask = (
  placements: Placement[],
  task: Task,
  slot: Slot,
  unavailable: Set<string>,
  classBusy: Set<string>,
  teacherBusy: Set<string>,
  subjectDayBusy: Set<string>,
) => {
  if (
    unavailable.has(
      teacherSlotKey(task.teacherId, slot.dayId, slot.periodId),
    )
  ) {
    return false;
  }

  if (
    classBusy.has(
      classSlotKey(task.classId, slot.dayId, slot.periodId),
    )
  ) {
    return false;
  }

  if (
    teacherBusy.has(
      teacherSlotKey(task.teacherId, slot.dayId, slot.periodId),
    )
  ) {
    return false;
  }

  /**
   * HARD RULE:
   *
   * One subject may appear at most once per class/day.
   */
  if (
    subjectDayBusy.has(
      classSubjectDayKey(
        task.classId,
        task.subjectId,
        slot.dayId,
      ),
    )
  ) {
    return false;
  }

  return true;
};

/**
 * Generates one candidate timetable.
 */
const buildAttempt = (
  tasks: Task[],
  slots: Slot[],
  unavailable: Set<string>,
  days: { id: string }[],
  periods: { id: number; number: number }[],
): GeneratedSchedule => {
  const placements: Placement[] = [];

  const classBusy = new Set<string>();
  const teacherBusy = new Set<string>();
  const subjectDayBusy = new Set<string>();

  /**
   * Track how many times each task has been scheduled.
   */
  const scheduledCount = new Map<string, number>();

  /**
   * First phase:
   *
   * Try to satisfy the requested weekly targets.
   *
   * Harder tasks go first.
   */
  const orderedTasks = shuffle(tasks).sort((a, b) => {
    const aAvailable = getAvailableSlots(
      a,
      slots,
      unavailable,
    );

    const bAvailable = getAvailableSlots(
      b,
      slots,
      unavailable,
    );

    /**
     * Fewer available slots = harder task = first.
     */
    if (aAvailable !== bAvailable) {
      return aAvailable - bAvailable;
    }

    /**
     * Higher requested amount = first.
     */
    return b.periodsPerWeek - a.periodsPerWeek;
  });

  for (const task of orderedTasks) {
    let remaining = task.periodsPerWeek;

    while (remaining > 0) {
      const candidates = slots.filter((slot) =>
        canPlaceTask(
          placements,
          task,
          slot,
          unavailable,
          classBusy,
          teacherBusy,
          subjectDayBusy,
        ),
      );

      if (candidates.length === 0) {
        break;
      }

      const scored = candidates
        .map((slot) => ({
          slot,
          score: scoreCandidate(
            placements,
            task,
            slot,
            days,
            periods,
          ),
        }))
        .sort((a, b) => a.score - b.score);

      /**
       * Randomly choose from the best candidates.
       */
      const shortlist = scored.slice(
        0,
        Math.min(5, scored.length),
      );

      const selected =
        shortlist[
          Math.floor(Math.random() * shortlist.length)
        ].slot;

      placements.push({
        ...task,
        dayId: selected.dayId,
        periodId: selected.periodId,
      });

      classBusy.add(
        classSlotKey(
          task.classId,
          selected.dayId,
          selected.periodId,
        ),
      );

      teacherBusy.add(
        teacherSlotKey(
          task.teacherId,
          selected.dayId,
          selected.periodId,
        ),
      );

      subjectDayBusy.add(
        classSubjectDayKey(
          task.classId,
          task.subjectId,
          selected.dayId,
        ),
      );

      scheduledCount.set(
        task.id,
        (scheduledCount.get(task.id) ?? 0) + 1,
      );

      remaining--;
    }
  }

  /**
   * ---------------------------------------------------------
   * PHASE 2
   * ---------------------------------------------------------
   *
   * Fill remaining empty class slots.
   *
   * This is the major difference from the old generator.
   *
   * We are now allowed to go ABOVE periodsPerWeek.
   */
  const classIds = [...new Set(tasks.map((task) => task.classId))];

  for (const classId of classIds) {
    const classTasks = tasks.filter(
      (task) => task.classId === classId,
    );

    const classSlots = slots.filter(
      (slot) =>
        !classBusy.has(
          classSlotKey(
            classId,
            slot.dayId,
            slot.periodId,
          ),
        ),
    );

    for (const emptySlot of shuffle(classSlots)) {
      /**
       * Find tasks that can legally occupy this slot.
       */
      const candidates = classTasks.filter((task) =>
        canPlaceTask(
          placements,
          task,
          emptySlot,
          unavailable,
          classBusy,
          teacherBusy,
          subjectDayBusy,
        ),
      );

      if (candidates.length === 0) {
        /**
         * No legal subject can fill this slot.
         */
        continue;
      }

      /**
       * Prefer subjects that are BELOW their requested target.
       */
      const scoredCandidates = candidates
        .map((task) => {
          const current = scheduledCount.get(task.id) ?? 0;

          const deficit = Math.max(
            0,
            task.periodsPerWeek - current,
          );

          const excess = Math.max(
            0,
            current - task.periodsPerWeek,
          );

          let score = 0;

          /**
           * Huge preference for completing target.
           */
          score -= deficit * 1000;

          /**
           * Avoid unnecessary excess.
           */
          score += excess * 250;

          /**
           * Use our normal placement scoring too.
           */
          score += scoreCandidate(
            placements,
            task,
            emptySlot,
            days,
            periods,
          );

          score += Math.random() * 10;

          return {
            task,
            score,
          };
        })
        .sort((a, b) => a.score - b.score);

      const selectedTask =
        scoredCandidates[
          Math.floor(
            Math.random() *
              Math.min(4, scoredCandidates.length),
          )
        ].task;

      placements.push({
        ...selectedTask,
        dayId: emptySlot.dayId,
        periodId: emptySlot.periodId,
      });

      classBusy.add(
        classSlotKey(
          selectedTask.classId,
          emptySlot.dayId,
          emptySlot.periodId,
        ),
      );

      teacherBusy.add(
        teacherSlotKey(
          selectedTask.teacherId,
          emptySlot.dayId,
          emptySlot.periodId,
        ),
      );

      subjectDayBusy.add(
        classSubjectDayKey(
          selectedTask.classId,
          selectedTask.subjectId,
          emptySlot.dayId,
        ),
      );

      scheduledCount.set(
        selectedTask.id,
        (scheduledCount.get(selectedTask.id) ?? 0) + 1,
      );
    }
  }

  /**
   * Calculate target differences.
   */
  let targetShortfall = 0;
  let targetExcess = 0;

  for (const task of tasks) {
    const actual = scheduledCount.get(task.id) ?? 0;

    if (actual < task.periodsPerWeek) {
      targetShortfall += task.periodsPerWeek - actual;
    }

    if (actual > task.periodsPerWeek) {
      targetExcess += actual - task.periodsPerWeek;
    }
  }

  /**
   * Calculate free periods.
   */
  const totalSlotsPerClass = slots.length;

  const totalClassSlots = classIds.length * totalSlotsPerClass;

  const freePeriods =
    totalClassSlots - placements.length;

  return {
    placements,
    targetShortfall,
    targetExcess,
    freePeriods,
  };
};

/**
 * Scores the entire timetable.
 *
 * LOWER = BETTER
 */
const scoreSchedule = (
  schedule: GeneratedSchedule,
  tasks: Task[],
  days: { id: string }[],
  periods: { id: number; number: number }[],
) => {
  const classIds = [
    ...new Set(tasks.map((task) => task.classId)),
  ];

  let score = 0;

  /**
   * ========================================================
   * ABSOLUTE PRIORITY: NO FREE PERIODS
   * ========================================================
   */
  score += schedule.freePeriods * 10_000_000;

  /**
   * ========================================================
   * SECOND: TARGET SHORTFALL
   * ========================================================
   */
  score += schedule.targetShortfall * 100_000;

  /**
   * ========================================================
   * THIRD: EXCESS
   * ========================================================
   */
  score += schedule.targetExcess * 2_000;

  /**
   * ========================================================
   * DAILY INTERNAL GAPS
   * ========================================================
   */
  for (const classId of classIds) {
    const gaps = calculateInternalGaps(
      schedule.placements,
      classId,
      days,
      periods,
    );

    score += gaps * 5_000;
  }

  /**
   * ========================================================
   * SUBJECT DISTRIBUTION
   * ========================================================
   *
   * We already enforce max 1/day.
   *
   * Here we reward using different days.
   */
  for (const task of tasks) {
    const subjectPlacements = schedule.placements.filter(
      (placement) =>
        placement.classId === task.classId &&
        placement.subjectId === task.subjectId,
    );

    const uniqueDays = new Set(
      subjectPlacements.map(
        (placement) => placement.dayId,
      ),
    ).size;

    const actual = subjectPlacements.length;

    /**
     * If a subject is scheduled 5 times,
     * ideally it should use 5 different days.
     */
    if (actual > 0 && uniqueDays < actual) {
      score += (actual - uniqueDays) * 100_000;
    }
  }

  /**
   * Small random component means equally good schedules
   * don't always look identical.
   */
  score += Math.random() * 100;

  return score;
};

export const generateTimetableForAllClasses = async (userId: string) => {
  const [
    days,
    periods,
    classes,
    assignments,
    availability,
  ] = await Promise.all([
    prisma.day.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    }),

    prisma.period.findMany({
      where: { userId },
      orderBy: { number: "asc" },
    }),

    prisma.class.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    }),

    prisma.teacherSubjectClass.findMany({
      where: {
        class: { userId },
        teacherSubject: {
          teacher: { userId },
          subject: { userId },
        },
      },
      include: {
        teacherSubject: true,
      },
    }),

    prisma.teacherAvailability.findMany({
      where: {
        isAvailable: false,
        teacher: { userId },
      },
    }),
  ]);

  if (days.length === 0) {
    throw new Error(
      "No school days are configured.",
    );
  }

  if (periods.length === 0) {
    throw new Error(
      "No periods are configured.",
    );
  }

  if (classes.length === 0) {
    throw new Error(
      "No classes are configured.",
    );
  }

  if (assignments.length === 0) {
    throw new Error(
      "No teacher/subject/class assignments exist. Add assignments before generating.",
    );
  }

  const tasks: Task[] = assignments
    .filter(
      (assignment) =>
        assignment.teacherSubject.periodsPerWeek > 0,
    )
    .map((assignment) => ({
      id: assignment.id,
      classId: assignment.classId,
      teacherSubjectId:
        assignment.teacherSubjectId,
      teacherId:
        assignment.teacherSubject.teacherId,
      subjectId:
        assignment.teacherSubject.subjectId,
      periodsPerWeek:
        assignment.teacherSubject.periodsPerWeek,
    }));

  const slots: Slot[] = days.flatMap(
    (day, dayIndex) =>
      periods.map((period, periodIndex) => ({
        dayId: day.id,
        periodId: period.id,
        dayIndex,
        periodIndex,
      })),
  );

  const unavailable = new Set(
    availability.map((item) =>
      teacherSlotKey(
        item.teacherId,
        item.dayId,
        item.periodId,
      ),
    ),
  );

  let best: GeneratedSchedule | null = null;
  let bestScore = Number.POSITIVE_INFINITY;

  let attemptsUsed = 0;

  for (
    let attempt = 0;
    attempt < MAX_ATTEMPTS;
    attempt++
  ) {
    attemptsUsed = attempt + 1;

    const candidate = buildAttempt(
      tasks,
      slots,
      unavailable,
      days,
      periods,
    );

    const score = scoreSchedule(
      candidate,
      tasks,
      days,
      periods,
    );

    if (score < bestScore) {
      bestScore = score;
      best = candidate;
    }

    /**
     * Perfect result:
     *
     * No free periods
     * No target shortfall
     */
    if (
      candidate.freePeriods === 0 &&
      candidate.targetShortfall === 0
    ) {
      /**
       * We can stop early because this is already a
       * complete valid schedule.
       */
      break;
    }
  }

  if (!best) {
    throw new Error(
      "Unable to build a timetable.",
    );
  }

  /**
   * ---------------------------------------------------------
   * Final safety validation
   * ---------------------------------------------------------
   */
  const classSlotSet = new Set<string>();
  const teacherSlotSet = new Set<string>();
  const subjectDaySet = new Set<string>();

  for (const placement of best.placements) {
    const classKey = classSlotKey(
      placement.classId,
      placement.dayId,
      placement.periodId,
    );

    if (classSlotSet.has(classKey)) {
      throw new Error(
        "Generator produced a class collision. Please try again.",
      );
    }

    classSlotSet.add(classKey);

    const teacherKey = teacherSlotKey(
      placement.teacherId,
      placement.dayId,
      placement.periodId,
    );

    if (teacherSlotSet.has(teacherKey)) {
      throw new Error(
        "Generator produced a teacher collision. Please try again.",
      );
    }

    teacherSlotSet.add(teacherKey);

    const subjectDayKey = classSubjectDayKey(
      placement.classId,
      placement.subjectId,
      placement.dayId,
    );

    if (subjectDaySet.has(subjectDayKey)) {
      throw new Error(
        "Generator produced a duplicate subject on the same day. Please try again.",
      );
    }

    subjectDaySet.add(subjectDayKey);
  }

  /**
   * Save everything atomically.
   */
  await prisma.$transaction(async (tx) => {
    await tx.timetable.deleteMany({ where: { class: { userId } } });

    if (best!.placements.length > 0) {
      await tx.timetable.createMany({
        data: best!.placements.map(
          (placement) => ({
            classId: placement.classId,
            teacherSubjectId:
              placement.teacherSubjectId,
            dayId: placement.dayId,
            periodId: placement.periodId,
          }),
        ),
      });
    }
  });

  const totalSlots =
    classes.length * slots.length;

  const scheduled =
    best.placements.length;

  const freePeriods =
    totalSlots - scheduled;

  const requested = tasks.reduce(
    (sum, task) =>
      sum + task.periodsPerWeek,
    0,
  );

  return {
    classes: classes.length,

    totalSlots,

    requested,

    scheduled,

    freePeriods,

    unscheduled: best.targetShortfall,

    targetShortfall:
      best.targetShortfall,

    targetExcess:
      best.targetExcess,

    freePeriodsInsideDailyBlocks:
      classes.reduce(
        (sum, cls) =>
          sum +
          calculateInternalGaps(
            best!.placements,
            cls.id,
            days,
            periods,
          ),
        0,
      ),

    optimized:
      freePeriods === 0 &&
      best.targetShortfall === 0,

    attempts: attemptsUsed,
  };
};

/**
 * Manually create a timetable entry.
 *
 * This remains compatible with the current frontend.
 */
export const createTimetableEntry = async (input: {
  classId: string;
  teacherId: string;
  subjectId: string;
  dayId: string;
  periodId: number;
  userId: string;
}) => {
  const {
    classId,
    teacherId,
    subjectId,
    dayId,
    periodId,
    userId,
  } = input;

  const teacherSubject =
    await prisma.teacherSubject.findFirst({
      where: {
        teacherId,
        subjectId,
        teacher: { userId },
        subject: { userId },
      },
    });

  if (!teacherSubject) {
    throw new Error(
      "This teacher is not assigned to this subject.",
    );
  }

  const classAssignment =
    await prisma.teacherSubjectClass.findUnique({
      where: {
        teacherSubjectId_classId: {
          teacherSubjectId:
            teacherSubject.id,
          classId,
        },
      },
    });

  if (!classAssignment) {
    throw new Error(
      "This teacher/subject is not assigned to this class.",
    );
  }

  const ownedClass = await prisma.class.findFirst({
    where: { id: classId, userId },
  });

  if (!ownedClass) {
    throw new Error("Class not found.");
  }

  const unavailable =
    await prisma.teacherAvailability.findUnique({
      where: {
        teacherId_dayId_periodId: {
          teacherId,
          dayId,
          periodId,
        },
      },
    });

  if (unavailable?.isAvailable === false) {
    throw new Error(
      "The teacher is unavailable during this period.",
    );
  }

  /**
   * Class collision.
   */
  const classBusy =
    await prisma.timetable.findFirst({
      where: {
        classId,
        dayId,
        periodId,
      },
    });

  if (classBusy) {
    throw new Error(
      "This class already has a lesson in that period.",
    );
  }

  /**
   * Teacher collision.
   */
  const teacherBusy =
    await prisma.timetable.findFirst({
      where: {
        teacherSubject: {
          teacherId,
        },
        dayId,
        periodId,
      },
    });

  if (teacherBusy) {
    throw new Error(
      "This teacher already has a lesson in that period.",
    );
  }

  /**
   * HARD RULE:
   *
   * Same subject cannot appear twice on the
   * same class/day.
   */
  const sameSubjectSameDay =
    await prisma.timetable.findFirst({
      where: {
        classId,
        dayId,
        teacherSubject: {
          subjectId,
        },
      },
    });

  if (sameSubjectSameDay) {
    throw new Error(
      "This subject is already scheduled for this class on this day.",
    );
  }

  return prisma.timetable.create({
    data: {
      classId,
      teacherSubjectId:
        teacherSubject.id,
      dayId,
      periodId,
    },

    include: {
      class: true,
      day: true,
      period: true,
      teacherSubject: {
        include: {
          teacher: true,
          subject: true,
        },
      },
    },
  });
};

export const deleteTimetableEntry = async (
  id: string,
  userId: string,
) => {
  const entry = await prisma.timetable.findFirst({
    where: { id, class: { userId } },
  });

  if (!entry) {
    throw new Error("Timetable entry not found.");
  }

  return prisma.timetable.delete({ where: { id } });
};




// type RepairState = {
//   entries: MutableEntry[];
//   moves: ProposedMove[];
// };

// /**
//  * Find all entries that currently conflict with
//  * a proposed state.
//  */
// const getConflicts = (
//   entries: MutableEntry[],
//   unavailable: Set<string>,
// ) => {
//   const conflictIds = new Set<string>();

//   const classSlots = new Map<
//     string,
//     MutableEntry[]
//   >();

//   const teacherSlots = new Map<
//     string,
//     MutableEntry[]
//   >();

//   const subjectDays = new Map<
//     string,
//     MutableEntry[]
//   >();

//   for (const entry of entries) {
//     const classKey = classSlotKey(
//       entry.classId,
//       entry.dayId,
//       entry.periodId,
//     );

//     const classList =
//       classSlots.get(classKey) ?? [];

//     classList.push(entry);
//     classSlots.set(
//       classKey,
//       classList,
//     );

//     const teacherKey =
//       teacherSlotKey(
//         entry.teacherId,
//         entry.dayId,
//         entry.periodId,
//       );

//     const teacherList =
//       teacherSlots.get(teacherKey) ??
//       [];

//     teacherList.push(entry);
//     teacherSlots.set(
//       teacherKey,
//       teacherList,
//     );

//     const subjectKey =
//       classSubjectDayKey(
//         entry.classId,
//         entry.subjectId,
//         entry.dayId,
//       );

//     const subjectList =
//       subjectDays.get(subjectKey) ??
//       [];

//     subjectList.push(entry);
//     subjectDays.set(
//       subjectKey,
//       subjectList,
//     );

//     if (
//       !isTeacherAvailable(
//         unavailable,
//         entry.teacherId,
//         entry.dayId,
//         entry.periodId,
//       )
//     ) {
//       conflictIds.add(entry.id);
//     }
//   }

//   for (const list of classSlots.values()) {
//     if (list.length > 1) {
//       /**
//        * Keep the first one for now.
//        * The search will decide which one moves.
//        */
//       for (let i = 1; i < list.length; i++) {
//         conflictIds.add(list[i].id);
//       }
//     }
//   }

//   for (const list of teacherSlots.values()) {
//     if (list.length > 1) {
//       for (let i = 1; i < list.length; i++) {
//         conflictIds.add(list[i].id);
//       }
//     }
//   }

//   for (const list of subjectDays.values()) {
//     if (list.length > 1) {
//       for (let i = 1; i < list.length; i++) {
//         conflictIds.add(list[i].id);
//       }
//     }
//   }

//   return [...conflictIds];
// };

// const getRepairCandidates = (
//   entries: MutableEntry[],
//   entry: MutableEntry,
//   days: { id: string }[],
//   periods: { id: number; number: number }[],
//   unavailable: Set<string>,
//   protectedEntryIds: Set<string>,
// ) => {
//   const candidates: {
//     dayId: string;
//     periodId: number;
//     score: number;
//   }[] = [];

//   for (const day of days) {
//     for (const period of periods) {
//       /**
//        * Don't move into a position occupied by an entry
//        * that is currently protected from being moved.
//        */
//       const occupant = entries.find(
//         (other) =>
//           other.id !== entry.id &&
//           other.classId === entry.classId &&
//           other.dayId === day.id &&
//           other.periodId === period.id,
//       );

//       if (
//         occupant &&
//         protectedEntryIds.has(
//           occupant.id,
//         )
//       ) {
//         continue;
//       }

//       if (
//         !canRepairEntryToSlot(
//           entries,
//           entry,
//           day.id,
//           period.id,
//           unavailable,
//         )
//       ) {
//         continue;
//       }

//       candidates.push({
//         dayId: day.id,
//         periodId: period.id,
//         score: repairSlotScore(
//           entries,
//           entry,
//           day.id,
//           period.id,
//           periods,
//         ),
//       });
//     }
//   }

//   return candidates.sort(
//     (a, b) => a.score - b.score,
//   );
// };

// /**
//  * Smart timetable repair.
//  *
//  * It attempts to satisfy the requested move while
//  * changing as few existing entries as possible.
//  */
// export const moveTimetableEntry = async ({
//   entryId,
//   dayId,
//   periodId,
// }: MoveRequest) => {
//   const [
//     existingEntries,
//     days,
//     periods,
//     availability,
//   ] = await Promise.all([
//     prisma.timetable.findMany({
//       include: {
//         teacherSubject: {
//           include: {
//             teacher: true,
//             subject: true,
//           },
//         },
//       },
//     }),

//     prisma.day.findMany({
//       orderBy: {
//         name: "asc",
//       },
//     }),

//     prisma.period.findMany({
//       orderBy: {
//         number: "asc",
//       },
//     }),

//     prisma.teacherAvailability.findMany({
//       where: {
//         isAvailable: false,
//       },
//     }),
//   ]);

//   const original =
//     existingEntries.find(
//       (entry) => entry.id === entryId,
//     );

//   if (!original) {
//     throw new Error(
//       "Timetable entry not found.",
//     );
//   }

//   const targetDay =
//     days.find(
//       (day) => day.id === dayId,
//     );

//   if (!targetDay) {
//     throw new Error(
//       "Target day not found.",
//     );
//   }

//   const targetPeriod =
//     periods.find(
//       (period) =>
//         period.id === periodId,
//     );

//   if (!targetPeriod) {
//     throw new Error(
//       "Target period not found.",
//     );
//   }

//   /**
//    * Don't do unnecessary work.
//    */
//   if (
//     original.dayId === dayId &&
//     original.periodId === periodId
//   ) {
//     return {
//       message: "Entry is already in this position.",
//       moved: [],
//       changes: 0,
//     };
//   }

//   const unavailable = new Set(
//     availability.map((item) =>
//       teacherSlotKey(
//         item.teacherId,
//         item.dayId,
//         item.periodId,
//       ),
//     ),
//   );

//   const entries: MutableEntry[] =
//     existingEntries.map(
//       (entry) => ({
//         id: entry.id,
//         classId: entry.classId,
//         teacherSubjectId:
//           entry.teacherSubjectId,
//         teacherId:
//           entry.teacherSubject.teacherId,
//         subjectId:
//           entry.teacherSubject.subjectId,
//         dayId: entry.dayId,
//         periodId: entry.periodId,
//       }),
//     );

//   /**
//    * The requested entry is special:
//    * the user explicitly asked for this move.
//    *
//    * We don't want the repair engine to move it again.
//    */
//   const protectedIds = new Set<string>([
//     entryId,
//   ]);

//   /**
//    * We'll use bounded DFS / backtracking.
//    */
//   let branches = 0;

//   let bestSolution:
//     RepairState | null = null;

//   /**
//    * Start by moving the requested entry.
//    */
//   const initialEntries =
//     cloneEntries(entries);

//   const movingEntry =
//     findEntry(
//       initialEntries,
//       entryId,
//     )!;

//   movingEntry.dayId = dayId;
//   movingEntry.periodId = periodId;

//   /**
//    * Recursive repair.
//    */
//   const search = (
//     state: RepairState,
//     depth: number,
//   ): void => {
//     branches++;

//     if (
//       branches > REPAIR_MAX_BRANCHES
//     ) {
//       return;
//     }

//     if (
//       bestSolution &&
//       state.moves.length >=
//         bestSolution.moves.length
//     ) {
//       return;
//     }

//     const conflicts =
//       getConflicts(
//         state.entries,
//         unavailable,
//       );

//     /**
//      * Success!
//      */
//     if (conflicts.length === 0) {
//       bestSolution = {
//         entries: cloneEntries(
//           state.entries,
//         ),
//         moves: [...state.moves],
//       };

//       return;
//     }

//     if (
//       depth >= REPAIR_MAX_DEPTH
//     ) {
//       return;
//     }

//     /**
//      * Pick the conflict with the fewest
//      * possible repair positions.
//      */
//     const conflictCandidates =
//       conflicts
//         .filter(
//           (id) =>
//             id !== entryId,
//         )
//         .map((id) => {
//           const conflictEntry =
//             findEntry(
//               state.entries,
//               id,
//             );

//           if (!conflictEntry) {
//             return null;
//           }

//           const candidates =
//             getRepairCandidates(
//               state.entries,
//               conflictEntry,
//               days,
//               periods,
//               unavailable,
//               protectedIds,
//             );

//           return {
//             entry: conflictEntry,
//             candidates,
//           };
//         })
//         .filter(
//           (
//             value,
//           ): value is {
//             entry: MutableEntry;
//             candidates: {
//               dayId: string;
//               periodId: number;
//               score: number;
//             }[];
//           } =>
//             value !== null,
//         )
//         .sort(
//           (a, b) =>
//             a.candidates.length -
//             b.candidates.length,
//         );

//     if (
//       conflictCandidates.length === 0
//     ) {
//       return;
//     }

//     const selectedConflict =
//       conflictCandidates[0];

//     /**
//      * If a conflict has no legal destination,
//      * this branch is impossible.
//      */
//     if (
//       selectedConflict.candidates
//         .length === 0
//     ) {
//       return;
//     }

//     /**
//      * Try only the best candidates first.
//      *
//      * We don't need to explore every possible
//      * period in the entire timetable.
//      */
//     const candidates =
//       selectedConflict.candidates.slice(
//         0,
//         8,
//       );

//     for (const candidate of candidates) {
//       const nextEntries =
//         cloneEntries(
//           state.entries,
//         );

//       const entryToMove =
//         findEntry(
//           nextEntries,
//           selectedConflict.entry.id,
//         );

//       if (!entryToMove) {
//         continue;
//       }

//       /**
//        * Before moving it, make sure the target
//        * doesn't contain another movable class entry.
//        *
//        * If it does, we'll recursively repair
//        * that occupant first.
//        */
//       const occupant =
//         nextEntries.find(
//           (other) =>
//             other.id !==
//               entryToMove.id &&
//             other.classId ===
//               entryToMove.classId &&
//             other.dayId ===
//               candidate.dayId &&
//             other.periodId ===
//               candidate.periodId,
//         );

//       if (
//         occupant &&
//         protectedIds.has(
//           occupant.id,
//         )
//       ) {
//         continue;
//       }

//       /**
//        * If there is an occupant, this candidate
//        * itself is a chain reaction.
//        *
//        * We temporarily move the selected entry,
//        * then the next search iteration will see
//        * the conflict and repair the occupant.
//        */
//       entryToMove.dayId =
//         candidate.dayId;

//       entryToMove.periodId =
//         candidate.periodId;

//       const nextMoves = [
//         ...state.moves,
//         {
//           entryId:
//             entryToMove.id,
//           dayId:
//             candidate.dayId,
//           periodId:
//             candidate.periodId,
//         },
//       ];

//       search(
//         {
//           entries: nextEntries,
//           moves: nextMoves,
//         },
//         depth + 1,
//       );
//     }
//   };

//   search(
//     {
//       entries: initialEntries,
//       moves: [
//         {
//           entryId,
//           dayId,
//           periodId,
//         },
//       ],
//     },
//     0,
//   );

//   if (!bestSolution) {
//     throw new Error(
//       "This lesson cannot be moved there without creating an invalid timetable. No safe repair was found.",
//     );
//   }

//   /**
//    * Make sure the requested entry actually ended up
//    * exactly where the user asked.
//    */
//   const finalRequested =
//     bestSolution.entries.find(
//       (entry) =>
//         entry.id === entryId,
//     );

//   if (
//     !finalRequested ||
//     finalRequested.dayId !== dayId ||
//     finalRequested.periodId !==
//       periodId
//   ) {
//     throw new Error(
//       "Unable to complete the requested move.",
//     );
//   }

//   /**
//    * Save every changed entry atomically.
//    */
//   await prisma.$transaction(
//     async (tx) => {
//       for (const move of bestSolution!.moves) {
//         await tx.timetable.update({
//           where: {
//             id: move.entryId,
//           },
//           data: {
//             dayId: move.dayId,
//             periodId:
//               move.periodId,
//           },
//         });
//       }
//     },
//   );

//   /**
//    * Return the updated timetable entries.
//    */
//   const changedIds = new Set(
//     bestSolution.moves.map(
//       (move) => move.entryId,
//     ),
//   );

//   const updatedEntries =
//     await prisma.timetable.findMany({
//       where: {
//         id: {
//           in: [...changedIds],
//         },
//       },
//       include: {
//         class: true,
//         day: true,
//         period: true,
//         teacherSubject: {
//           include: {
//             teacher: true,
//             subject: true,
//           },
//         },
//       },
//     });

//   return {
//     message:
//       "Timetable updated successfully.",
//     moved: updatedEntries,
//     changes:
//       bestSolution.moves.length,
//   };
// };

type MoveRequest = {
  entryId: string;
  dayId: string;
  periodId: number;
  userId?: string;
};

type MutableEntry = {
  id: string;
  classId: string;
  teacherSubjectId: string;
  teacherId: string;
  subjectId: string;
  dayId: string;
  periodId: number;
};

type ProposedMove = {
  entryId: string;
  dayId: string;
  periodId: number;
};

type RepairState = {
  entries: MutableEntry[];
  moves: ProposedMove[];
};

/**
 * Limits for the repair search.
 *
 * The algorithm uses bounded backtracking so a bad
 * timetable cannot cause an infinite search.
 */
const REPAIR_MAX_DEPTH = 12;
const REPAIR_MAX_BRANCHES = 10000;

const cloneEntries = (
  entries: MutableEntry[],
): MutableEntry[] =>
  entries.map((entry) => ({
    ...entry,
  }));

const findEntry = (
  entries: MutableEntry[],
  id: string,
) =>
  entries.find(
    (entry) => entry.id === id,
  );

const samePosition = (
  entry: MutableEntry,
  dayId: string,
  periodId: number,
) =>
  entry.dayId === dayId &&
  entry.periodId === periodId;

const isTeacherAvailable = (
  unavailable: Set<string>,
  teacherId: string,
  dayId: string,
  periodId: number,
) =>
  !unavailable.has(
    teacherSlotKey(
      teacherId,
      dayId,
      periodId,
    ),
  );

/**
 * Checks whether an entry can use a particular
 * day/period.
 *
 * IMPORTANT:
 *
 * We intentionally DO NOT reject an occupied class slot.
 *
 * If another lesson occupies that slot, the repair
 * algorithm will move that lesson somewhere else.
 */
const canEntryUseSlot = (
  entries: MutableEntry[],
  entry: MutableEntry,
  dayId: string,
  periodId: number,
  unavailable: Set<string>,
) => {
  /**
   * Teacher unavailable.
   */
  if (
    !isTeacherAvailable(
      unavailable,
      entry.teacherId,
      dayId,
      periodId,
    )
  ) {
    return false;
  }

  /**
   * Teacher cannot teach two classes
   * at the same time.
   */
  const teacherConflict =
    entries.some(
      (other) =>
        other.id !== entry.id &&
        other.teacherId === entry.teacherId &&
        other.dayId === dayId &&
        other.periodId === periodId,
    );

  if (teacherConflict) {
    return false;
  }

  /**
   * Same subject cannot occur twice for
   * the same class on the same day.
   */
  const subjectConflict =
    entries.some(
      (other) =>
        other.id !== entry.id &&
        other.classId === entry.classId &&
        other.subjectId === entry.subjectId &&
        other.dayId === dayId,
    );

  if (subjectConflict) {
    return false;
  }

  /**
   * DO NOT check class collision here.
   *
   * The class slot may already contain another
   * lesson. That lesson will be repaired.
   */
  return true;
};

/**
 * Returns the lesson occupying a class slot.
 */
const getClassOccupant = (
  entries: MutableEntry[],
  classId: string,
  dayId: string,
  periodId: number,
  ignoreEntryId?: string,
) =>
  entries.find(
    (entry) =>
      entry.id !== ignoreEntryId &&
      entry.classId === classId &&
      entry.dayId === dayId &&
      entry.periodId === periodId,
  );

/**
 * Given a group of entries that collide on the
 * same slot/key, decide which ones must be
 * flagged for repair.
 *
 * A protected entry (the lesson the user just
 * dragged) can NEVER be the one that gets
 * flagged - it is not allowed to move again.
 *
 * If a protected entry is part of the group, it
 * is always the one that is kept, and every other
 * entry in the group is flagged instead.
 *
 * If no protected entry is part of the group, we
 * fall back to keeping the first entry, same as
 * before.
 */
const flagCollisionGroup = (
  list: MutableEntry[],
  protectedIds: Set<string>,
  conflictIds: Set<string>,
) => {
  if (list.length <= 1) {
    return;
  }

  const keepIndex = list.findIndex((entry) =>
    protectedIds.has(entry.id),
  );

  const indexToKeep =
    keepIndex >= 0 ? keepIndex : 0;

  for (let i = 0; i < list.length; i++) {
    if (i === indexToKeep) {
      continue;
    }

    conflictIds.add(list[i].id);
  }
};

/**
 * Find every invalid entry in the current state.
 */
const getConflicts = (
  entries: MutableEntry[],
  unavailable: Set<string>,
  protectedIds: Set<string>,
) => {
  const conflictIds = new Set<string>();

  const classSlots = new Map<
    string,
    MutableEntry[]
  >();

  const teacherSlots = new Map<
    string,
    MutableEntry[]
  >();

  const subjectDays = new Map<
    string,
    MutableEntry[]
  >();

  for (const entry of entries) {
    /**
     * Teacher availability.
     */
    if (
      !isTeacherAvailable(
        unavailable,
        entry.teacherId,
        entry.dayId,
        entry.periodId,
      )
    ) {
      conflictIds.add(entry.id);
    }

    /**
     * Class slot.
     */
    const classKey = classSlotKey(
      entry.classId,
      entry.dayId,
      entry.periodId,
    );

    const classList =
      classSlots.get(classKey) ?? [];

    classList.push(entry);
    classSlots.set(
      classKey,
      classList,
    );

    /**
     * Teacher slot.
     */
    const teacherKey =
      teacherSlotKey(
        entry.teacherId,
        entry.dayId,
        entry.periodId,
      );

    const teacherList =
      teacherSlots.get(teacherKey) ?? [];

    teacherList.push(entry);
    teacherSlots.set(
      teacherKey,
      teacherList,
    );

    /**
     * Subject/day.
     */
    const subjectKey =
      classSubjectDayKey(
        entry.classId,
        entry.subjectId,
        entry.dayId,
    );

    const subjectList =
      subjectDays.get(subjectKey) ?? [];

    subjectList.push(entry);
    subjectDays.set(
      subjectKey,
      subjectList,
    );
  }

  /**
   * Class collisions.
   *
   * Keep the protected lesson (if any) or the
   * first lesson, and repair the rest.
   */
  for (const list of classSlots.values()) {
    flagCollisionGroup(
      list,
      protectedIds,
      conflictIds,
    );
  }

  /**
   * Teacher collisions.
   */
  for (const list of teacherSlots.values()) {
    flagCollisionGroup(
      list,
      protectedIds,
      conflictIds,
    );
  }

  /**
   * Duplicate subject on the same
   * class/day.
   */
  for (const list of subjectDays.values()) {
    flagCollisionGroup(
      list,
      protectedIds,
      conflictIds,
    );
  }

  return [...conflictIds];
};

/**
 * Scores a possible repair destination.
 *
 * LOWER = BETTER
 */
const scoreRepairPosition = (
  entries: MutableEntry[],
  entry: MutableEntry,
  dayId: string,
  periodId: number,
  periods: {
    id: number;
    number: number;
  }[],
) => {
  let score = 0;

  const newPeriodIndex =
    periods.findIndex(
      (period) =>
        period.id === periodId,
    );

  const oldPeriodIndex =
    periods.findIndex(
      (period) =>
        period.id === entry.periodId,
    );

  /**
   * Prefer keeping the same day.
   */
  if (entry.dayId !== dayId) {
    score += 100;
  }

  /**
   * Prefer staying near the old period.
   */
  if (
    oldPeriodIndex >= 0 &&
    newPeriodIndex >= 0
  ) {
    score +=
      Math.abs(
        oldPeriodIndex -
          newPeriodIndex,
      ) * 5;
  }

  /**
   * Prefer compact class schedules.
   */
  const sameDayEntries =
    entries.filter(
      (other) =>
        other.id !== entry.id &&
        other.classId === entry.classId &&
        other.dayId === dayId,
    );

  if (
    sameDayEntries.length > 0 &&
    newPeriodIndex >= 0
  ) {
    const indices =
      sameDayEntries
        .map((other) =>
          periods.findIndex(
            (period) =>
              period.id ===
              other.periodId,
          ),
        )
        .filter(
          (index) => index >= 0,
        );

    if (indices.length > 0) {
      const min = Math.min(
        ...indices,
        newPeriodIndex,
      );

      const max = Math.max(
        ...indices,
        newPeriodIndex,
      );

      const span =
        max - min + 1;

      score +=
        (span -
          (indices.length + 1)) *
        10;
    }
  }

  /**
   * Avoid unnecessary movement.
   */
  if (
    entry.dayId === dayId &&
    entry.periodId === periodId
  ) {
    score -= 1000;
  }

  return score;
};

/**
 * Get possible destinations for an entry.
 *
 * An occupied class slot is allowed because
 * the occupant can be repaired recursively.
 */
const getRepairCandidates = (
  entries: MutableEntry[],
  entry: MutableEntry,
  days: {
    id: string;
  }[],
  periods: {
    id: number;
    number: number;
  }[],
  unavailable: Set<string>,
  protectedIds: Set<string>,
) => {
  const candidates: {
    dayId: string;
    periodId: number;
    score: number;
  }[] = [];

  for (const day of days) {
    for (const period of periods) {
      /**
       * Don't move an entry to its current
       * position.
       */
      if (
        samePosition(
          entry,
          day.id,
          period.id,
        )
      ) {
        continue;
      }

      /**
       * Don't move onto a protected entry.
       *
       * The user's dragged lesson is protected.
       */
      const occupant =
        getClassOccupant(
          entries,
          entry.classId,
          day.id,
          period.id,
          entry.id,
        );

      if (
        occupant &&
        protectedIds.has(
          occupant.id,
        )
      ) {
        continue;
      }

      /**
       * Teacher availability,
       * teacher collision and subject/day
       * are still hard constraints.
       *
       * Class occupancy is allowed.
       */
      if (
        !canEntryUseSlot(
          entries,
          entry,
          day.id,
          period.id,
          unavailable,
        )
      ) {
        continue;
      }

      candidates.push({
        dayId: day.id,
        periodId: period.id,
        score:
          scoreRepairPosition(
            entries,
            entry,
            day.id,
            period.id,
            periods,
          ),
      });
    }
  }

  return candidates.sort(
    (a, b) =>
      a.score - b.score,
  );
};

/**
 * Move a timetable lesson while automatically
 * repairing conflicting lessons.
 *
 * The lesson selected by the user is NEVER moved
 * again after being placed at the requested slot.
 */
export const moveTimetableEntry = async ({
  entryId,
  dayId,
  periodId,
  userId,
}: MoveRequest) => {
  const [
    existingEntries,
    days,
    periods,
    availability,
  ] = await Promise.all([
    prisma.timetable.findMany({
      where: userId ? { class: { userId } } : undefined,
      include: {
        teacherSubject: {
          include: {
            teacher: true,
            subject: true,
          },
        },
        class: true,
      },
    }),

    prisma.day.findMany({
      where: userId ? { userId } : undefined,
      orderBy: {
        name: "asc",
      },
    }),

    prisma.period.findMany({
      where: userId ? { userId } : undefined,
      orderBy: {
        number: "asc",
      },
    }),

    prisma.teacherAvailability.findMany({
      where: {
        isAvailable: false,
        ...(userId ? { teacher: { userId } } : {}),
      },
    }),
  ]);

  const original = existingEntries.find(
    (entry) => entry.id === entryId,
  );

  if (!original) {
    throw new Error("Timetable entry not found.");
  }

  const targetDay = days.find(
    (day) => day.id === dayId,
  );

  if (!targetDay) {
    throw new Error("Target day not found.");
  }

  const targetPeriod = periods.find(
    (period) => period.id === periodId,
  );

  if (!targetPeriod) {
    throw new Error("Target period not found.");
  }

  /**
   * No-op.
   */
  if (
    original.dayId === dayId &&
    original.periodId === periodId
  ) {
    return {
      message: "Entry is already in this position.",
      moved: [],
      changes: 0,
    };
  }

  const unavailable = new Set(
    availability.map((item) =>
      teacherSlotKey(
        item.teacherId,
        item.dayId,
        item.periodId,
      ),
    ),
  );

  const entries: MutableEntry[] =
    existingEntries.map((entry) => ({
      id: entry.id,
      classId: entry.classId,
      teacherSubjectId:
        entry.teacherSubjectId,
      teacherId:
        entry.teacherSubject.teacherId,
      subjectId:
        entry.teacherSubject.subjectId,
      dayId: entry.dayId,
      periodId: entry.periodId,
    }));

  /**
   * The entry the user dragged is protected.
   *
   * It MUST remain at the requested destination.
   */
  const protectedIds = new Set<string>([
    entryId,
  ]);

  let branches = 0;

  let bestSolution: RepairState | null = null;

  /**
   * ---------------------------------------------------------
   * INITIAL MOVE
   * ---------------------------------------------------------
   */

  const initialEntries = cloneEntries(entries);

  const movingEntry = findEntry(
    initialEntries,
    entryId,
  );

  if (!movingEntry) {
    throw new Error("Timetable entry not found.");
  }

  movingEntry.dayId = dayId;
  movingEntry.periodId = periodId;

  /**
   * ---------------------------------------------------------
   * SEARCH
   * ---------------------------------------------------------
   */

  const search = (
    state: RepairState,
    depth: number,
  ): void => {
    branches++;

    if (branches > REPAIR_MAX_BRANCHES) {
      return;
    }

    /**
     * We already have a solution with fewer moves.
     */
    if (
      bestSolution &&
      state.moves.length >=
        bestSolution.moves.length
    ) {
      return;
    }

    const conflicts = getConflicts(
      state.entries,
      unavailable,
      protectedIds,
    );

    /**
     * No conflicts = valid timetable.
     */
    if (conflicts.length === 0) {
      bestSolution = {
        entries: cloneEntries(state.entries),
        moves: [...state.moves],
      };

      return;
    }

    if (depth >= REPAIR_MAX_DEPTH) {
      return;
    }

    /**
     * Never move the lesson explicitly dragged
     * by the user.
     */
    const movableConflicts = conflicts.filter(
      (id) => id !== entryId,
    );

    if (movableConflicts.length === 0) {
      return;
    }

    /**
     * For every conflicting lesson, calculate
     * possible destinations.
     */
    const conflictCandidates = movableConflicts
      .map((id) => {
        const conflictEntry = findEntry(
          state.entries,
          id,
        );

        if (!conflictEntry) {
          return null;
        }

        const candidates =
          getRepairCandidates(
            state.entries,
            conflictEntry,
            days,
            periods,
            unavailable,
            protectedIds,
          );

        return {
          entry: conflictEntry,
          candidates,
        };
      })
      .filter(
        (
          value,
        ): value is {
          entry: MutableEntry;
          candidates: {
            dayId: string;
            periodId: number;
            score: number;
          }[];
        } => value !== null,
      )
      .sort(
        (a, b) =>
          a.candidates.length -
          b.candidates.length,
      );

    if (conflictCandidates.length === 0) {
      return;
    }

    const selectedConflict =
      conflictCandidates[0];

    if (
      selectedConflict.candidates.length === 0
    ) {
      return;
    }

    /**
     * Try a reasonable number of best destinations.
     */
    const candidates =
      selectedConflict.candidates.slice(0, 12);

    for (const candidate of candidates) {
      if (branches > REPAIR_MAX_BRANCHES) {
        return;
      }

      const nextEntries = cloneEntries(
        state.entries,
      );

      const entryToMove = findEntry(
        nextEntries,
        selectedConflict.entry.id,
      );

      if (!entryToMove) {
        continue;
      }

      /**
       * Check if another lesson currently occupies
       * the target class slot.
       */
      const occupant = nextEntries.find(
        (other) =>
          other.id !== entryToMove.id &&
          other.classId ===
            entryToMove.classId &&
          other.dayId === candidate.dayId &&
          other.periodId ===
            candidate.periodId,
      );

      /**
       * Protected entries can never be moved.
       */
      if (
        occupant &&
        protectedIds.has(occupant.id)
      ) {
        continue;
      }

      /**
       * Move the conflicting entry in the simulated
       * timetable.
       *
       * If this creates another conflict, the next
       * recursive search handles it.
       */
      entryToMove.dayId = candidate.dayId;
      entryToMove.periodId =
        candidate.periodId;

      const nextMoves: ProposedMove[] = [
        ...state.moves,
        {
          entryId: entryToMove.id,
          dayId: candidate.dayId,
          periodId: candidate.periodId,
        },
      ];

      search(
        {
          entries: nextEntries,
          moves: nextMoves,
        },
        depth + 1,
      );
    }
  };

  search(
    {
      entries: initialEntries,
      moves: [
        {
          entryId,
          dayId,
          periodId,
        },
      ],
    },
    0,
  );

  if (!bestSolution) {
    throw new Error(
      "This lesson cannot be moved there without creating an invalid timetable. No safe repair was found.",
    );
  }

  /**
   * ---------------------------------------------------------
   * FINAL VALIDATION
   * ---------------------------------------------------------
   */

  const finalRequested =
    bestSolution.entries.find(
      (entry) => entry.id === entryId,
    );

  if (
    !finalRequested ||
    finalRequested.dayId !== dayId ||
    finalRequested.periodId !== periodId
  ) {
    throw new Error(
      "Unable to complete the requested move.",
    );
  }

  /**
   * ---------------------------------------------------------
   * SAVE
   * ---------------------------------------------------------
   *
   * IMPORTANT:
   *
   * We cannot simply execute:
   *
   * A -> B
   * B -> A
   *
   * because PostgreSQL sees the first update while B
   * still occupies the destination.
   *
   * Therefore:
   *
   * 1. Move every changed entry to a temporary slot.
   * 2. Apply the final positions.
   *
   * This prevents the UNIQUE(classId, dayId, periodId)
   * constraint from being violated during the transaction.
   */

  const changedMoves = bestSolution.moves.filter(
    (move, index, array) => {
      const firstIndex = array.findIndex(
        (other) =>
          other.entryId === move.entryId,
      );

      return firstIndex === index;
    },
  );

  /**
   * Don't include entries that technically didn't move.
   */
  const actualMoves = changedMoves.filter(
    (move) => {
      const originalEntry =
        existingEntries.find(
          (entry) =>
            entry.id === move.entryId,
        );

      return (
        originalEntry &&
        (
          originalEntry.dayId !==
            move.dayId ||
          originalEntry.periodId !==
            move.periodId
        )
      );
    },
  );

  /**
   * Generate temporary slots.
   *
   * These slots are only used during the transaction
   * and are never exposed to the user.
   *
   * We use unique temporary day/period combinations
   * by using existing slots that are NOT currently
   * occupied by any timetable entry.
   *
   * If there aren't enough free slots, we use a
   * two-phase ID-only strategy below.
   */

  await prisma.$transaction(
    async (tx) => {
      /**
       * -----------------------------------------------------
       * PHASE 1
       * -----------------------------------------------------
       *
       * Move changed entries to temporary positions.
       *
       * We use a unique temporary period/day combination
       * generated from the existing IDs.
       *
       * Since the database has a UNIQUE constraint on
       * classId/dayId/periodId, each temporary position
       * must also be unique for that class.
       */

      const temporarySlots: {
        dayId: string;
        periodId: number;
      }[] = [];

      /**
       * Find slots that are not currently used by ANY
       * timetable entry.
       */
      const occupiedSlots = new Set(
        existingEntries.map(
          (entry) =>
            `${entry.classId}::${entry.dayId}::${entry.periodId}`,
        ),
      );

      /**
       * We need one temporary slot per changed entry.
       *
       * Search all configured slots.
       */
      for (const day of days) {
        for (const period of periods) {
          const usedByChangedClass =
            actualMoves.some((move) => {
              const originalEntry =
                existingEntries.find(
                  (entry) =>
                    entry.id ===
                    move.entryId,
                );

              if (!originalEntry) {
                return false;
              }

              return occupiedSlots.has(
                `${originalEntry.classId}::${day.id}::${period.id}`,
              );
            });

          if (usedByChangedClass) {
            continue;
          }

          temporarySlots.push({
            dayId: day.id,
            periodId: period.id,
          });
        }
      }

      /**
       * We actually need temporary slots per CLASS,
       * not globally.
       *
       * Therefore generate them separately below.
       */

      const usedTemporaryKeys =
        new Set<string>();

      /**
       * PHASE 1:
       *
       * For every changed entry, find a temporary slot
       * that is free for its class.
       */
      const temporaryAssignments: {
        entryId: string;
        dayId: string;
        periodId: number;
      }[] = [];

      for (const move of actualMoves) {
        const current =
          existingEntries.find(
            (entry) =>
              entry.id === move.entryId,
          );

        if (!current) {
          throw new Error(
            "Unable to find entry during repair.",
          );
        }

        let found = false;

        for (const day of days) {
          for (const period of periods) {
            const tempKey =
              `${current.classId}::${day.id}::${period.id}`;

            /**
             * Must not currently be occupied.
             */
            if (
              occupiedSlots.has(tempKey)
            ) {
              continue;
            }

            /**
             * Must not already be assigned as a
             * temporary position.
             */
            if (
              usedTemporaryKeys.has(
                tempKey,
              )
            ) {
              continue;
            }

            /**
             * Don't accidentally use the final
             * position of another changed entry.
             */
            const isFinalPosition =
              actualMoves.some(
                (other) => {
                  const otherEntry =
                    existingEntries.find(
                      (entry) =>
                        entry.id ===
                        other.entryId,
                    );

                  if (!otherEntry) {
                    return false;
                  }

                  return (
                    otherEntry.classId ===
                      current.classId &&
                    other.dayId === day.id &&
                    other.periodId ===
                      period.id
                  );
                },
              );

            if (isFinalPosition) {
              continue;
            }

            temporaryAssignments.push({
              entryId: move.entryId,
              dayId: day.id,
              periodId: period.id,
            });

            usedTemporaryKeys.add(
              tempKey,
            );

            found = true;
            break;
          }

          if (found) {
            break;
          }
        }

        if (!found) {
          throw new Error(
            "Unable to create temporary positions for the timetable repair.",
          );
        }
      }

      /**
       * Move everything away from its current position.
       */
      for (const temporary of temporaryAssignments) {
        await tx.timetable.update({
          where: {
            id: temporary.entryId,
          },
          data: {
            dayId: temporary.dayId,
            periodId: temporary.periodId,
          },
        });
      }

      /**
       * -----------------------------------------------------
       * PHASE 2
       * -----------------------------------------------------
       *
       * Now all original positions are free.
       *
       * Apply the actual requested/repair positions.
       */

      for (const move of actualMoves) {
        await tx.timetable.update({
          where: {
            id: move.entryId,
          },
          data: {
            dayId: move.dayId,
            periodId: move.periodId,
          },
        });
      }
    },
  );

  /**
   * ---------------------------------------------------------
   * RETURN UPDATED ENTRIES
   * ---------------------------------------------------------
   */

  const changedIds = new Set(
    actualMoves.map(
      (move) => move.entryId,
    ),
  );

  const updatedEntries =
    await prisma.timetable.findMany({
      where: {
        id: {
          in: [...changedIds],
        },
      },
      include: {
        class: true,
        day: true,
        period: true,
        teacherSubject: {
          include: {
            teacher: true,
            subject: true,
          },
        },
      },
    });

  return {
    message:
      "Timetable updated successfully.",
    moved: updatedEntries,
    changes: actualMoves.length,
  };
};