"use client"

import * as React from "react"
import { ModalWrapper } from "./modal-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface AddRoomModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddRoomModal({ isOpen, onClose }: AddRoomModalProps) {
  const [facilities, setFacilities] = React.useState<string[]>([])
  const [currentFacility, setCurrentFacility] = React.useState("")

  const handleAddFacility = () => {
    if (currentFacility.trim() && !facilities.includes(currentFacility.trim())) {
      setFacilities([...facilities, currentFacility.trim()])
      setCurrentFacility("")
    }
  }

  const handleRemoveFacility = (facility: string) => {
    setFacilities(facilities.filter((f) => f !== facility))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Room form submitted")
    // Add your form submission logic here
    onClose()
  }

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Room"
      description="Register a new classroom or facility"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="roomName">Room Name</Label>
          <Input id="roomName" placeholder="e.g., Room 101" required className="bg-background/50" />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="roomType">Room Type</Label>
            <select
              id="roomType"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Select type...</option>
              <option value="classroom">Classroom</option>
              <option value="laboratory">Laboratory</option>
              <option value="auditorium">Auditorium</option>
              <option value="library">Library</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="floor">Floor</Label>
            <Input id="floor" type="number" placeholder="1" min="0" max="10" required className="bg-background/50" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="capacity">Capacity</Label>
          <Input id="capacity" type="number" placeholder="30" min="1" required className="bg-background/50" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            required
            className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="facilities">Facilities</Label>
          <div className="flex gap-2">
            <Input
              id="facilities"
              placeholder="e.g., Projector, Whiteboard"
              value={currentFacility}
              onChange={(e) => setCurrentFacility(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddFacility()
                }
              }}
              className="bg-background/50"
            />
            <Button type="button" onClick={handleAddFacility} variant="secondary">
              Add
            </Button>
          </div>
          {facilities.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {facilities.map((facility) => (
                <Badge key={facility} variant="secondary" className="gap-1">
                  {facility}
                  <button
                    type="button"
                    onClick={() => handleRemoveFacility(facility)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4 border-t border-border/50">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            Add Room
          </Button>
        </div>
      </form>
    </ModalWrapper>
  )
}
