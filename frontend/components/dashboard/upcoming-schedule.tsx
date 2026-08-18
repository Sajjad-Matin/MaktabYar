"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

const schedules = [
  {
    id: 1,
    class: "Class 10-A",
    subject: "Mathematics",
    teacher: "Dr. Smith",
    time: "09:00 - 10:00",
    room: "Room 201",
    status: "ongoing" as const,
  },
  {
    id: 2,
    class: "Class 9-B",
    subject: "Physics",
    teacher: "Prof. Johnson",
    time: "10:00 - 11:00",
    room: "Room 302",
    status: "upcoming" as const,
  },
  {
    id: 3,
    class: "Class 11-C",
    subject: "Chemistry",
    teacher: "Dr. Williams",
    time: "11:00 - 12:00",
    room: "Room 405",
    status: "upcoming" as const,
  },
]

export function UpcomingSchedule() {
  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>Upcoming Classes</CardTitle>
        <CardDescription>Today's schedule overview</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="flex items-center gap-3 rounded-lg border border-border/50 bg-card/50 p-3 transition-all duration-200 hover:bg-accent/30"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Clock className="h-5 w-5" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{schedule.subject}</span>
                  <Badge variant={schedule.status === "ongoing" ? "default" : "secondary"} className="text-xs">
                    {schedule.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {schedule.class} • {schedule.teacher} • {schedule.room}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium">{schedule.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
