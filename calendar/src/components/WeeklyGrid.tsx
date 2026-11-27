import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { Clock, Trash2 } from 'lucide-react';
import type { CalendarEvent } from '../types/calendar';

interface WeeklyGridProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  events: CalendarEvent[];
  onDeleteEvent: (id: string) => void;
}

const HOURS = [9, 10, 11, 12, 13, 14];

export function WeeklyGrid({ selectedDate, onSelectDate, events, onDeleteEvent }: WeeklyGridProps) {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <section data-bento="matrix" aria-label="Schedule">
      <header data-matrix-head>
        <span data-tz>GMT+07</span>
        {days.map((day) => {
          const isActive = isSameDay(day, selectedDate);
          return (
            <article
              key={day.toISOString()}
              data-active={isActive}
              onClick={() => onSelectDate(day)}
            >
              <small>{format(day, 'EEE')}</small>
              <strong>{format(day, 'd')}</strong>
            </article>
          );
        })}
      </header>

      {HOURS.map((hour) => {
        const label =
          hour === 12
            ? '12:00 PM'
            : hour > 12
              ? `${String(hour - 12).padStart(2, '0')}:00 PM`
              : `${String(hour).padStart(2, '0')}:00 AM`;

        return (
          <ol key={hour} data-matrix-row>
            <li data-hour>{label}</li>
            {days.map((day) => {
              const key = format(day, 'yyyy-MM-dd');
              const isActiveDay = isSameDay(day, selectedDate);
              const slotEvents = events.filter((e) => e.date === key && e.startHour === hour);
              return (
                <li key={key} data-slot data-active-day={isActiveDay}>
                  {slotEvents.map((evt) => (
                    <article key={evt.id} data-event data-tone={evt.tone}>
                      <button
                        type="button"
                        data-del
                        aria-label={`Delete ${evt.title}`}
                        onClick={() => onDeleteEvent(evt.id)}
                      >
                        <Trash2 size={13} strokeWidth={2} />
                      </button>
                      <h3>{evt.title}</h3>
                      <time>
                        <Clock size={12} strokeWidth={2} />
                        <span>{evt.timeRange}</span>
                      </time>
                    </article>
                  ))}
                </li>
              );
            })}
          </ol>
        );
      })}
    </section>
  );
}
