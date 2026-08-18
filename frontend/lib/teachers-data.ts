export type Teacher = {
  id: string
  name: string
  email: string
  department: string
  subjects: string[]
  hoursPerWeek: number
  status: "active" | "inactive"
}

export const sampleTeachers: Teacher[] = [
  {
    id: "1",
    name: "Dr. Robert Smith",
    email: "r.smith@school.edu",
    department: "Mathematics",
    subjects: ["Mathematics", "Statistics"],
    hoursPerWeek: 20,
    status: "active",
  },
  {
    id: "2",
    name: "Prof. Sarah Johnson",
    email: "s.johnson@school.edu",
    department: "Science",
    subjects: ["Physics", "Advanced Physics"],
    hoursPerWeek: 18,
    status: "active",
  },
  {
    id: "3",
    name: "Dr. Michael Williams",
    email: "m.williams@school.edu",
    department: "Science",
    subjects: ["Chemistry", "Organic Chemistry"],
    hoursPerWeek: 22,
    status: "active",
  },
  {
    id: "4",
    name: "Ms. Emily Brown",
    email: "e.brown@school.edu",
    department: "Languages",
    subjects: ["English", "Literature"],
    hoursPerWeek: 16,
    status: "active",
  },
  {
    id: "5",
    name: "Dr. David Lee",
    email: "d.lee@school.edu",
    department: "Science",
    subjects: ["Biology", "Ecology"],
    hoursPerWeek: 19,
    status: "active",
  },
  {
    id: "6",
    name: "Mr. James Davis",
    email: "j.davis@school.edu",
    department: "Technology",
    subjects: ["Computer Science", "Programming"],
    hoursPerWeek: 20,
    status: "active",
  },
]

export type Class = {
  id: string
  name: string
  grade: number
  section: string
  students: number
  classTeacher: string
  subjects: string[]
}

export const sampleClasses: Class[] = [
  {
    id: "1",
    name: "Class 10-A",
    grade: 10,
    section: "A",
    students: 32,
    classTeacher: "Dr. Robert Smith",
    subjects: ["Mathematics", "Physics", "Chemistry", "English", "Biology"],
  },
  {
    id: "2",
    name: "Class 10-B",
    grade: 10,
    section: "B",
    students: 30,
    classTeacher: "Prof. Sarah Johnson",
    subjects: ["Mathematics", "Physics", "Chemistry", "English", "History"],
  },
  {
    id: "3",
    name: "Class 9-A",
    grade: 9,
    section: "A",
    students: 28,
    classTeacher: "Ms. Emily Brown",
    subjects: ["Mathematics", "Science", "English", "History", "Geography"],
  },
  {
    id: "4",
    name: "Class 9-B",
    grade: 9,
    section: "B",
    students: 29,
    classTeacher: "Dr. David Lee",
    subjects: ["Mathematics", "Science", "English", "Computer Science"],
  },
  {
    id: "5",
    name: "Class 11-A",
    grade: 11,
    section: "A",
    students: 25,
    classTeacher: "Dr. Michael Williams",
    subjects: ["Advanced Mathematics", "Physics", "Chemistry", "English"],
  },
]
