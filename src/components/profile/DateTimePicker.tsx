"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { CalendarClock, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DateTimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export function DateTimePicker24h({ date, setDate }: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const updateDate = (updater: (d: Date) => void) => {
    const next = date ? new Date(date) : new Date();
    updater(next);
    setDate(next);
  };

  const pickerContent = (
    <div className="flex flex-col sm:flex-row bg-brand-card dark:bg-brand-navy w-full">

      <div className="w-fit sm:w-auto">
        <Calendar
          mode="single"
          selected={date}
          className="w-full"
          onSelect={(d) =>
            d &&
            updateDate((next) => {
              next.setFullYear(d.getFullYear(), d.getMonth(), d.getDate());
            })
          }
        />
      </div>

      {/* Time scrollers */}
      <div className="flex flex-row h-48 sm:h-72 border-t sm:border-t-0 sm:border-l border-brand-border divide-x divide-brand-border">
        <ScrollArea className="flex-1 sm:w-14 h-full">
          <div className="flex flex-col p-1 gap-1">
            <span className="text-[10px] text-center sticky top-0 bg-brand-card dark:bg-brand-navy text-brand-muted py-0.5 font-bold">
              Hr
            </span>
            {Array.from({ length: 24 }, (_, i) => 23 - i).map((h) => (
              <Button
                key={h}
                size="sm"
                variant={date?.getHours() === h ? "default" : "ghost"}
                className="w-full shrink-0 text-xs h-7 rounded-lg"
                onClick={() => updateDate((d) => d.setHours(h))}
              >
                {h.toString().padStart(2, "0")}
              </Button>
            ))}
          </div>
        </ScrollArea>
        <ScrollArea className="flex-1 sm:w-14 h-full">
          <div className="flex flex-col p-1 gap-1">
            <span className="text-[10px] text-center sticky top-0 bg-brand-card dark:bg-brand-navy text-brand-muted py-0.5 font-bold">
              Min
            </span>
            {Array.from({ length: 60 }, (_, i) => i).map((m) => (
              <Button
                key={m}
                size="sm"
                variant={date?.getMinutes() === m ? "default" : "ghost"}
                className="w-full shrink-0 text-xs h-7 rounded-lg"
                onClick={() => updateDate((d) => d.setMinutes(m))}
              >
                {m.toString().padStart(2, "0")}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );

  const trigger = (
    <Button
      variant="outline"
      onClick={() => setIsOpen((v) => !v)}
      className={cn(
        "mt-1 w-full justify-start text-left font-normal rounded-xl border border-brand-border bg-transparent px-3 py-1.5 text-xs",
        !date && "text-brand-muted"
      )}
    >
      <CalendarClock className="mr-1.5 h-3.5 w-3.5 text-brand-muted" />
      {date ? format(date, "MM/dd/yyyy HH:mm") : <span>Select Date & Time</span>}
    </Button>
  );

  if (isMobile) {
    return (
      <>
        {trigger}
        {isOpen &&
          createPortal(
            <div
              className="fixed inset-0 z-10000 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
              onClick={() => setIsOpen(false)}
            >
              <div
                className="w-full max-w-[92vw] rounded-2xl border border-brand-border overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-3 py-2 bg-brand-card border-b border-brand-border">
                  <span className="text-xs font-semibold text-brand-heading">
                    Pick Date & Time
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
                {pickerContent}
              </div>
            </div>,
            document.body
          )}
      </>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        className="p-0 z-10000 border border-brand-border w-auto rounded-2xl overflow-hidden shadow-2xl"
        align="start"
        side="bottom"
        sideOffset={6}
        avoidCollisions={true}
        collisionPadding={16}
      >
        {pickerContent}
      </PopoverContent>
    </Popover>
  );
}