import { useState, useEffect, useRef } from 'react';
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
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CalendarEvent, HolstTone, EventCategory } from '../types/calendar';

interface EventModalProps {
  isOpen: boolean;
  defaultDate: Date;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'id'>) => void;
}

const TONES: { id: HolstTone; label: string }[] = [
  { id: 'pine', label: 'Deep Pine' },
  { id: 'sage', label: 'Sage Green' },
  { id: 'mist', label: 'Soft Mist' },
  { id: 'sand', label: 'Warm Sand' },
];

function parseStartHour(timeText: string): number {
  const match = timeText.trim().match(/^(\d{1,2})(?::\d{2})?\s*(AM|PM)?/i);
  if (!match) return 9;
  let hour = Number(match[1]);
  const period = match[2]?.toUpperCase();
  if (period === 'PM' && hour < 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 9;
  return Math.min(14, Math.max(9, hour));
}

export function EventModal({ isOpen, defaultDate, onClose, onSave }: EventModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [title, setTitle] = useState('');
  const [pickedDate, setPickedDate] = useState<Date>(defaultDate);
  const [viewMonth, setViewMonth] = useState<Date>(defaultDate);
  const [timeInput, setTimeInput] = useState('09:00 AM - 10:00 AM');
  const [category, setCategory] = useState<EventCategory>('meetings');
  const [tone, setTone] = useState<HolstTone>('pine');

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (isOpen && !el.open) {
      setPickedDate(defaultDate);
      setViewMonth(defaultDate);
      el.showModal();
    } else if (!isOpen && el.open) {
      el.close();
    }
  }, [isOpen, defaultDate]);

  const monthStart = startOfMonth(viewMonth);
  const calendarDays = eachDayOfInterval({
    start: startOfWeek(monthStart),
    end: endOfWeek(endOfMonth(monthStart)),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const cleanTime = timeInput.trim() || '09:00 AM - 10:00 AM';
    onSave({
      title: title.trim(),
      date: format(pickedDate, 'yyyy-MM-dd'),
      startHour: parseStartHour(cleanTime),
      timeRange: cleanTime,
      category,
      tone,
    });
    setTitle('');
    onClose();
  };

  return (
    <dialog ref={dialogRef} data-modal onClose={onClose}>
      <h2>New Event</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Event Title
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Design Review Holst"
          />
        </label>

        <fieldset>
          <legend>Date ({format(pickedDate, 'MMM d, yyyy')})</legend>
          <section data-holst-picker>
            <header>
              <span>{format(viewMonth, 'MMMM yyyy')}</span>
              <nav>
                <button
                  type="button"
                  data-btn="icon"
                  aria-label="Previous month"
                  onClick={() => setViewMonth(subMonths(viewMonth, 1))}
                >
                  <ChevronLeft size={14} strokeWidth={2} />
                </button>
                <button
                  type="button"
                  data-btn="icon"
                  aria-label="Next month"
                  onClick={() => setViewMonth(addMonths(viewMonth, 1))}
                >
                  <ChevronRight size={14} strokeWidth={2} />
                </button>
              </nav>
            </header>
            <ol data-mini-grid>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <li key={i} data-weekday>{d}</li>
              ))}
              {calendarDays.map((day) => (
                <li key={day.toISOString()}>
                  <button
                    type="button"
                    data-selected={isSameDay(day, pickedDate)}
                    data-muted={!isSameMonth(day, viewMonth)}
                    onClick={() => setPickedDate(day)}
                  >
                    {format(day, 'd')}
                  </button>
                </li>
              ))}
            </ol>
          </section>
        </fieldset>

        <label>
          Start Time (AM/PM)
          <input
            type="text"
            required
            value={timeInput}
            onChange={(e) => setTimeInput(e.target.value)}
            placeholder="09:00 AM - 10:00 AM"
          />
        </label>

        <label>
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value as EventCategory)}>
            <option value="meetings">Meetings</option>
            <option value="tasks">Tasks</option>
            <option value="milestones">Milestones</option>
            <option value="personal">Personal</option>
          </select>
        </label>

        <fieldset>
          <legend>Block Color</legend>
          <menu data-swatches>
            {TONES.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  data-tone={t.id}
                  data-selected={tone === t.id}
                  aria-label={t.label}
                  title={t.label}
                  onClick={() => setTone(t.id)}
                />
              </li>
            ))}
          </menu>
        </fieldset>

        <menu data-actions>
          <li>
            <button type="button" data-chip onClick={onClose}>Cancel</button>
          </li>
          <li>
            <button type="submit" data-btn="primary">Save Event</button>
          </li>
        </menu>
      </form>
    </dialog>
  );
}
