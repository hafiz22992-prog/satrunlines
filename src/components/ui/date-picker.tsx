import * as React from "react"
import { format, parseISO } from "date-fns"
import { ar } from "date-fns/locale"
import { CalendarDays } from "lucide-react"

import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  id?: string
  value: string
  onChange: (value: string) => void
  min?: string
  disabled?: boolean
  "aria-invalid"?: boolean
}

function toIsoDate(date: Date) { return format(date, "yyyy-MM-dd") }
function parseDate(value: string) {
  if (!value) return undefined
  const parsed = parseISO(value)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

export function DatePicker({ id, value, onChange, min, disabled, "aria-invalid": ariaInvalid }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const selected = parseDate(value)
  const minDate = parseDate(min ?? "")

  return (
    <div id={id} className="w-full" dir="rtl">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            aria-invalid={ariaInvalid}
            aria-label={selected ? "تاريخ السفر " + format(selected, "d MMMM yyyy", { locale: ar }) : "اختيار تاريخ السفر"}
            className={cn("h-11 w-full justify-between rounded-md border-input bg-transparent px-3 text-right font-normal", !value && "text-muted-foreground", ariaInvalid && "border-destructive")}
          >
            <span className="flex min-w-0 items-center gap-2" dir="rtl">
              <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
              {selected ? (
                <span className="flex items-baseline gap-2" dir="ltr" style={{ unicodeBidi: "isolate" }}>
                  <span className="whitespace-nowrap" dir="rtl" style={{ unicodeBidi: "isolate" }}>{format(selected, "d", { locale: ar })}</span>
                  <span className="text-muted-foreground">|</span>
                  <span className="whitespace-nowrap" dir="rtl" style={{ unicodeBidi: "isolate" }}>{format(selected, "MMMM", { locale: ar })}</span>
                  <span className="text-muted-foreground">|</span>
                  <span className="whitespace-nowrap" dir="ltr" style={{ unicodeBidi: "isolate" }}>{format(selected, "yyyy")}</span>
                </span>
              ) : (
                <span className="flex items-baseline gap-2 text-sm" dir="rtl">
                  <span>يوم</span><span>|</span><span>شهر</span><span>|</span><span>سنة</span>
                </span>
              )}
            </span>
            <span className="text-xs text-muted-foreground">{selected ? "تغيير" : "اختيار"}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0" dir="rtl">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={(date) => { if (!date) return; onChange(toIsoDate(date)); setOpen(false) }}
            disabled={minDate ? { before: minDate } : undefined}
            locale={ar}
            dir="rtl"
            initialFocus
            className="rounded-md border-0"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}