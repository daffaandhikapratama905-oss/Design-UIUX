import { useState, useEffect } from 'react';
import type { CalendarEvent } from '../types/calendar';
import { INITIAL_EVENTS } from '../data/dummyEvents';

const STORAGE_KEY = 'uiux_weekly_calendar_v1';

export function useLocalEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_EVENTS;
    } catch {
      return INITIAL_EVENTS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  const addEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: crypto.randomUUID(),
    };
    setEvents((prev) => [...prev, newEvent]);
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((item) => item.id !== id));
  };

  return { events, addEvent, deleteEvent };
}
