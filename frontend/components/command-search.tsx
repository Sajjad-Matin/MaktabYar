"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useTeacher } from "@/hooks/teacher/use-teachers";
import { useSubject } from "@/hooks/subject/use-subject";
import { useClass } from "@/hooks/class/use-class";
import {
  User,
  BookOpen,
  GraduationCap,
  Search,
  LayoutDashboard,
  Calendar,
  ClipboardList,
  Settings,
} from "lucide-react";

export function CommandSearch({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const router = useRouter();
  const { teachers } = useTeacher();
  const { subjects } = useSubject();
  const { classes } = useClass();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, setOpen]);

  const runCommand = React.useCallback(
    (command: () => void) => {
      setOpen(false);
      command();
    },
    [setOpen]
  );

  if (!mounted) return null;

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search teachers, subjects, classes or navigation..." />
      <CommandList className="max-h-[450px]">
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Quick Navigation">
          <CommandItem onSelect={() => runCommand(() => router.push("/"))}>
            <LayoutDashboard className="mr-2 h-4 w-4 text-blue-500" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/timetable"))}
          >
            <Calendar className="mr-2 h-4 w-4 text-purple-500" />
            <span>Timetable</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/assignments"))}
          >
            <ClipboardList className="mr-2 h-4 w-4 text-cyan-500" />
            <span>Assignments</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/settings"))}
          >
            <Settings className="mr-2 h-4 w-4 text-slate-500" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Teachers">
          {teachers.map((teacher) => (
            <CommandItem
              key={teacher.id}
              value={teacher.name}
              onSelect={() => runCommand(() => router.push("/teachers"))}
            >
              <User className="mr-2 h-4 w-4 text-orange-500" />
              <span>{teacher.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Subjects">
          {subjects.map((subject) => (
            <CommandItem
              key={subject.id}
              value={subject.name}
              onSelect={() => runCommand(() => router.push("/subjects"))}
            >
              <BookOpen className="mr-2 h-4 w-4 text-pink-500" />
              <span>{subject.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Classes">
          {classes.map((cls) => (
            <CommandItem
              key={cls.id}
              value={cls.name}
              onSelect={() => runCommand(() => router.push("/classes"))}
            >
              <GraduationCap className="mr-2 h-4 w-4 text-green-500" />
              <span>{cls.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
