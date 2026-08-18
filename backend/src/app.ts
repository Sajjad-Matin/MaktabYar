import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import classRoute from "./routes/class.route";
import subjectRoute from "./routes/subject.route";
import teacherRoute from "./routes/teacher.route";
import teacherSubjectRoute from "./routes/teacherSubject.route";
import teacherSubjectClassRoute from "./routes/teacherSubjectClass.route";
import dayRoute from "./routes/day.route";
import periodRoute from "./routes/period.route";
import teacherAvailabilityRoute from "./routes/teacherAvailability.route";
import timetableRoute from "./routes/timetable.route";
import timetableHistoryRoute from "./routes/timetable-history.route";
import authRoute from "./routes/auth.route";
import packageRoute from "./routes/package.route";
import { requireAuth, requireAdmin } from "./middleware/auth.middleware";
import adminRoute from "./routes/admin.route";

dotenv.config();

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins.length ? allowedOrigins : true,
  credentials: true,
}));
app.use(express.json());

// Public routes
app.use("/api/auth", authRoute);
app.use("/api/packages", packageRoute);

// Administrator-only management routes
app.use("/api/admin", requireAuth, requireAdmin, adminRoute);

// Protected routes
app.use("/api/subjects", requireAuth, subjectRoute);
app.use("/api/teachers", requireAuth, teacherRoute);
app.use("/api/teacherSubjects", requireAuth, teacherSubjectRoute);
app.use("/api/classes", requireAuth, classRoute);
app.use("/api/teacherSubjectClasses", requireAuth, teacherSubjectClassRoute);
app.use("/api/day", requireAuth, dayRoute);
app.use("/api/period", requireAuth, periodRoute);
app.use("/api/timetable", requireAuth, timetableRoute);
app.use("/api/timetable-history", requireAuth, timetableHistoryRoute);
app.use("/api/teacherAvailability", requireAuth, teacherAvailabilityRoute);

app.get("/", (_, res) => {
  res.send("Timetable Manager API is running 🚀");
});

export default app;
