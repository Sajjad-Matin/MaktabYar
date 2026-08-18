export type TimeSlot = {
  id: string
  day: string
  time: string
  subject: string | null
  teacher: string | null
  room: string | null
  class: string
  color?: string
  hasConflict?: boolean
}

export const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
export const timeSlots = [
  "08:00 - 09:00",
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 13:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
]

export const subjectColors: Record<string, string> = {
  Mathematics: "bg-chart-1 text-white border-chart-1",
  Physics: "bg-chart-2 text-white border-chart-2",
  Chemistry: "bg-chart-3 text-white border-chart-3",
  English: "bg-chart-4 text-white border-chart-4",
  History: "bg-chart-5 text-white border-chart-5",
  Biology: "bg-primary text-primary-foreground border-primary",
  "Computer Science": "bg-secondary text-secondary-foreground border-secondary",
}

// Sample timetable data
export const sampleTimetable: TimeSlot[] = [
  {
    id: "1",
    day: "Monday",
    time: "09:00 - 10:00",
    subject: "Mathematics",
    teacher: "Dr. Smith",
    room: "Room 201",
    class: "Class 10-A",
    color: subjectColors.Mathematics,
  },
  {
    id: "2",
    day: "Monday",
    time: "10:00 - 11:00",
    subject: "Physics",
    teacher: "Prof. Johnson",
    room: "Room 302",
    class: "Class 10-A",
    color: subjectColors.Physics,
  },
  {
    id: "3",
    day: "Monday",
    time: "11:00 - 12:00",
    subject: "Chemistry",
    teacher: "Dr. Williams",
    room: "Room 405",
    class: "Class 10-A",
    color: subjectColors.Chemistry,
  },
  {
    id: "4",
    day: "Tuesday",
    time: "09:00 - 10:00",
    subject: "English",
    teacher: "Ms. Brown",
    room: "Room 101",
    class: "Class 10-A",
    color: subjectColors.English,
  },
  {
    id: "5",
    day: "Tuesday",
    time: "10:00 - 11:00",
    subject: "Mathematics",
    teacher: "Dr. Smith",
    room: "Room 201",
    class: "Class 10-A",
    color: subjectColors.Mathematics,
  },
  {
    id: "6",
    day: "Tuesday",
    time: "13:00 - 14:00",
    subject: "Biology",
    teacher: "Dr. Lee",
    room: "Lab 1",
    class: "Class 10-A",
    color: subjectColors.Biology,
  },
  {
    id: "7",
    day: "Wednesday",
    time: "09:00 - 10:00",
    subject: "Computer Science",
    teacher: "Mr. Davis",
    room: "Lab 3",
    class: "Class 10-A",
    color: subjectColors["Computer Science"],
    hasConflict: true,
  },
  {
    id: "8",
    day: "Wednesday",
    time: "10:00 - 11:00",
    subject: "History",
    teacher: "Mrs. Anderson",
    room: "Room 203",
    class: "Class 10-A",
    color: subjectColors.History,
  },
  {
    id: "9",
    day: "Thursday",
    time: "09:00 - 10:00",
    subject: "Physics",
    teacher: "Prof. Johnson",
    room: "Room 302",
    class: "Class 10-A",
    color: subjectColors.Physics,
  },
  {
    id: "10",
    day: "Thursday",
    time: "11:00 - 12:00",
    subject: "Mathematics",
    teacher: "Dr. Smith",
    room: "Room 201",
    class: "Class 10-A",
    color: subjectColors.Mathematics,
  },
  {
    id: "11",
    day: "Friday",
    time: "09:00 - 10:00",
    subject: "English",
    teacher: "Ms. Brown",
    room: "Room 101",
    class: "Class 10-A",
    color: subjectColors.English,
  },
  {
    id: "12",
    day: "Friday",
    time: "10:00 - 11:00",
    subject: "Chemistry",
    teacher: "Dr. Williams",
    room: "Room 405",
    class: "Class 10-A",
    color: subjectColors.Chemistry,
  },
]
