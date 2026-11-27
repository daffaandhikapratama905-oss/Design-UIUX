import { useEffect, useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  addMonths,
  subMonths,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import type { CalendarEvent } from '../types/calendar';

interface BentoRailProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  nextEvent?: CalendarEvent;
}

export function BentoRail({ selectedDate, onSelectDate, nextEvent }: BentoRailProps) {
  const [isOpen, setIsOpen] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  );

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = (e: MediaQueryListEvent) => setIsOpen(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const monthStart = startOfMonth(selectedDate);
  const days = eachDayOfInterval({
    start: startOfWeek(monthStart),
    end: endOfWeek(endOfMonth(monthStart)),
  });

  return (
    <section data-bento="rail-stack" aria-label="Summary and mini calendar">
      <article data-tile="spotlight">
        <small>Upcoming Event</small>
        <h2>{nextEvent ? nextEvent.title : 'No upcoming events'}</h2>
        <time>
          <Clock size={14} strokeWidth={2} />
          <span>{nextEvent ? `${nextEvent.date} • ${nextEvent.timeRange}` : 'Clear schedule'}</span>
        </time>
      </article>

      <details
        data-tile="mini-month"
        open={isOpen}
        onToggle={(e) => setIsOpen((e.currentTarget as HTMLDetailsElement).open)}
      >
        <summary>
          <span>{format(selectedDate, 'MMMM yyyy')}</span>
          <span data-hint>{isOpen ? 'Hide' : 'Month grid'}</span>
        </summary>

        <nav data-month-nav>
          <span>Jump date</span>
          <menu>
            <li>
              <button
                type="button"
                data-btn="icon"
                aria-label="Previous month"
                onClick={() => onSelectDate(subMonths(selectedDate, 1))}
              >
                <ChevronLeft size={14} strokeWidth={2} />
              </button>
            </li>
            <li>
              <button
                type="button"
                data-btn="icon"
                aria-label="Next month"
                onClick={() => onSelectDate(addMonths(selectedDate, 1))}
              >
                <ChevronRight size={14} strokeWidth={2} />
              </button>
            </li>
          </menu>
        </nav>

        <ol data-mini-grid>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <li key={i} data-weekday>{d}</li>
          ))}
          {days.map((day) => (
            <li key={day.toISOString()}>
              <button
                type="button"
                data-selected={isSameDay(day, selectedDate)}
                data-muted={!isSameMonth(day, selectedDate)}
                onClick={() => onSelectDate(day)}
              >
                {format(day, 'd')}
              </button>
            </li>
          ))}
        </ol>
      </details>
    </section>
  );
}
