import * as React from "react"

import { cn } from "@/lib/utils"

function formatDateDisplay(value: unknown) {
  if (typeof value !== "string" || !value) return ""
  const [year, month, day] = value.split("-")
  if (!year || !month || !day) return value
  return `${day} / ${month} / ${year}`
}

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  if (type === "date") {
    const value = props.value ?? props.defaultValue ?? ""

    return (
      <div className="relative w-full">
        <input
          type="text"
          value={formatDateDisplay(value)}
          placeholder="DD / MM / YYYY"
          readOnly
          aria-hidden="true"
          tabIndex={-1}
          disabled={props.disabled}
          data-slot="input-date-display"
          className={cn(
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            "cursor-pointer",
            className,
          )}
        />
        <input
          {...props}
          type="date"
          data-slot="input"
          className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
          aria-label={props["aria-label"] ?? "التاريخ"}
        />
      </div>
    )
  }

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
