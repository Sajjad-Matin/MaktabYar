"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, BookOpen, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

const activities = [
  {
    id: 1,
    type: "timetable",
    message: "Timetable updated for Class 10-A",
    time: "2 hours ago",
    icon: Calendar,
    color: "text-primary",
  },
  {
    id: 2,
    type: "teacher",
    message: "New teacher added: Dr. Sarah Johnson",
    time: "4 hours ago",
    icon: Users,
    color: "text-chart-2",
  },
  {
    id: 3,
    type: "conflict",
    message: "Schedule conflict detected in Room 301",
    time: "5 hours ago",
    icon: AlertTriangle,
    color: "text-warning",
  },
  {
    id: 4,
    type: "subject",
    message: "Advanced Mathematics added to curriculum",
    time: "1 day ago",
    icon: BookOpen,
    color: "text-chart-3",
  },
]

export function RecentActivity() {
  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates and changes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 transition-colors duration-200 hover:bg-accent/50 rounded-lg p-2 -ml-2"
            >
              <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg bg-accent", activity.color)}>
                <activity.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="text-sm font-medium leading-none">{activity.message}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
