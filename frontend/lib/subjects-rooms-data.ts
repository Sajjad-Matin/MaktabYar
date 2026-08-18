export type Subject = {
  id: string
  name: string
  code: string
  department: string
  hoursPerWeek: number
  teachers: string[]
  classes: string[]
}

export type Room = {
  id: string
  name: string
  type: "classroom" | "laboratory" | "auditorium" | "library"
  capacity: number
  floor: number
  facilities: string[]
  status: "available" | "occupied" | "maintenance"
}

export const sampleSubjects: Subject[] = [
  {
    id: "1",
    name: "Mathematics",
    code: "MATH-101",
    department: "Mathematics",
    hoursPerWeek: 5,
    teachers: ["Dr. Robert Smith"],
    classes: ["Class 10-A", "Class 10-B", "Class 9-A"],
  },
  {
    id: "2",
    name: "Physics",
    code: "PHY-201",
    department: "Science",
    hoursPerWeek: 4,
    teachers: ["Prof. Sarah Johnson"],
    classes: ["Class 10-A", "Class 10-B"],
  },
  {
    id: "3",
    name: "Chemistry",
    code: "CHEM-202",
    department: "Science",
    hoursPerWeek: 4,
    teachers: ["Dr. Michael Williams"],
    classes: ["Class 10-A", "Class 11-A"],
  },
  {
    id: "4",
    name: "English",
    code: "ENG-101",
    department: "Languages",
    hoursPerWeek: 4,
    teachers: ["Ms. Emily Brown"],
    classes: ["Class 10-A", "Class 9-A", "Class 9-B"],
  },
  {
    id: "5",
    name: "Biology",
    code: "BIO-301",
    department: "Science",
    hoursPerWeek: 3,
    teachers: ["Dr. David Lee"],
    classes: ["Class 10-A", "Class 9-B"],
  },
  {
    id: "6",
    name: "Computer Science",
    code: "CS-401",
    department: "Technology",
    hoursPerWeek: 3,
    teachers: ["Mr. James Davis"],
    classes: ["Class 10-A", "Class 9-B", "Class 11-A"],
  },
]

export const sampleRooms: Room[] = [
  {
    id: "1",
    name: "Room 101",
    type: "classroom",
    capacity: 35,
    floor: 1,
    facilities: ["Projector", "Whiteboard", "AC"],
    status: "available",
  },
  {
    id: "2",
    name: "Room 201",
    type: "classroom",
    capacity: 40,
    floor: 2,
    facilities: ["Smart Board", "Projector", "AC"],
    status: "occupied",
  },
  {
    id: "3",
    name: "Room 302",
    type: "classroom",
    capacity: 38,
    floor: 3,
    facilities: ["Projector", "Whiteboard", "Sound System"],
    status: "available",
  },
  {
    id: "4",
    name: "Lab 1",
    type: "laboratory",
    capacity: 30,
    floor: 1,
    facilities: ["Lab Equipment", "Safety Gear", "Microscopes"],
    status: "available",
  },
  {
    id: "5",
    name: "Lab 3",
    type: "laboratory",
    capacity: 32,
    floor: 3,
    facilities: ["Computers", "Servers", "Network Equipment"],
    status: "occupied",
  },
  {
    id: "6",
    name: "Room 405",
    type: "classroom",
    capacity: 45,
    floor: 4,
    facilities: ["Smart Board", "Projector", "AC", "Sound System"],
    status: "available",
  },
  {
    id: "7",
    name: "Auditorium",
    type: "auditorium",
    capacity: 200,
    floor: 1,
    facilities: ["Stage", "Sound System", "Projector", "AC"],
    status: "available",
  },
  {
    id: "8",
    name: "Room 203",
    type: "classroom",
    capacity: 36,
    floor: 2,
    facilities: ["Whiteboard", "Projector"],
    status: "maintenance",
  },
]
