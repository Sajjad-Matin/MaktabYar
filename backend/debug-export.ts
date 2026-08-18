import app from "./src/app.ts";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "development-only-secret-change-me";

const server = app.listen(0, async () => {
  const port = (server.address() as any).port;
  const token = jwt.sign(
    {
      userId: "ceeeebca-5bbe-4cf6-8174-6c4f2d72190f",
      email: "admin@example.com",
      role: "ADMIN",
    },
    secret,
    { expiresIn: "7d" },
  );

  const res = await fetch(
    `http://localhost:${port}/api/timetable/export?format=xlsx&view=class`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  console.log("STATUS", res.status);
  console.log("CTYPE", res.headers.get("content-type"));
  const text = await res.text();
  console.log("BODY", text.slice(0, 2000));
  server.close();
});
