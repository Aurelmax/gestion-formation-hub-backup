"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Clock as ClockIcon } from "lucide-react"
import { fr } from 'date-fns/locale'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

interface DateTimePickerProps {
  date?: Date
  setDate: (date: Date | undefined) => void
}

// Génère des options pour les heures de 8h à 20h
const hoursOptions = Array.from({ length: 13 }, (_, i) => i + 8).map(hour => ({
  value: hour.toString(),
  label: hour.toString().padStart(2, '0') + ':00'
}))

// Génère des options pour les minutes par tranches de 15
const minutesOptions = Array.from({ length: 4 }, (_, i) => i * 15).map(minute => ({
  value: minute.toString(),
  label: minute.toString().padStart(2, '0')
}))

export function DateTimePicker({ date, setDate }: DateTimePickerProps) {
  // États pour gérer les heures et minutes sélectionnées
  const [selectedHour, setSelectedHour] = React.useState<string>(
    date ? format(date, "HH") : "09"
  )
  const [selectedMinute, setSelectedMinute] = React.useState<string>(
    date ? format(date, "mm") : "00"
  )

  // Mise à jour de l'heure lorsque la date change
  React.useEffect(() => {
    if (date) {
      setSelectedHour(format(date, "HH"))
      setSelectedMinute(format(date, "mm"))
    }
  }, [date])

  // Mettre à jour la date avec l'heure et les minutes sélectionnées
  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      const hour = parseInt(selectedHour)
      const minute = parseInt(selectedMinute)
      newDate.setHours(hour, minute)
    }
    setDate(newDate)
  }

  // Mettre à jour l'heure sur la date existante
  const handleTimeChange = (hour: string, minute: string) => {
    setSelectedHour(hour)
    setSelectedMinute(minute)
    
    if (date) {
      const newDate = new Date(date)
      newDate.setHours(parseInt(hour), parseInt(minute))
      setDate(newDate)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <ClockIcon className="mr-2 h-4 w-4" />
            {date ? (
              format(date, "P HH:mm", { locale: fr })
            ) : (
              <span>Sélectionner date et heure</span>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Tabs defaultValue="date">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="date">Date</TabsTrigger>
            <TabsTrigger value="time">Heure</TabsTrigger>
          </TabsList>
          <TabsContent value="date" className="p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateChange}
              initialFocus
              locale={fr}
            />
          </TabsContent>
          <TabsContent value="time" className="p-3">
            <div className="flex space-x-2 items-center">
              <div className="grid gap-2">
                <div className="grid gap-1">
                  <p className="text-sm font-medium">Heures</p>
                  <Select
                    value={selectedHour}
                    onValueChange={(value) => {
                      handleTimeChange(value, selectedMinute)
                    }}
                  >
                    <SelectTrigger className="w-[110px]">
                      <SelectValue placeholder="Heure" />
                    </SelectTrigger>
                    <SelectContent>
                      {hoursOptions.map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <div className="grid gap-1">
                  <p className="text-sm font-medium">Minutes</p>
                  <Select
                    value={selectedMinute}
                    onValueChange={(value) => {
                      handleTimeChange(selectedHour, value)
                    }}
                  >
                    <SelectTrigger className="w-[110px]">
                      <SelectValue placeholder="Minute" />
                    </SelectTrigger>
                    <SelectContent>
                      {minutesOptions.map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}
