import { format, startOfWeek, addDays } from 'date-fns';
import type { CalendarEvent } from '../types/calendar';

const monday = startOfWeek(new Date(), { weekStartsOn: 1 });

export const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: 'evt-1',
    title: 'UX Huddle Call',
    date: format(addDays(monday, 2), 'yyyy-MM-dd'),
    startHour: 9,
    timeRange: '09:00 AM - 09:30 AM',
    category: 'meetings',
    tone: 'pine',
  },
  {
    id: 'evt-2',
    title: 'Analytics Kickoff',
    date: format(addDays(monday, 3), 'yyyy-MM-dd'),
    startHour: 9,
    timeRange: '09:00 AM - 10:00 AM',
    category: 'meetings',
    tone: 'sand',
  },
  {
    id: 'evt-3',
    title: 'Standup NovaBoard',
    date: format(monday, 'yyyy-MM-dd'),
    startHour: 10,
    timeRange: '10:00 AM - 10:45 AM',
    category: 'meetings',
    tone: 'sage',
  },
  {
    id: 'evt-4',
    title: 'Frontend API Mapping',
    date: format(addDays(monday, 1), 'yyyy-MM-dd'),
    startHour: 10,
    timeRange: '10:00 AM - 11:30 AM',
    category: 'tasks',
    tone: 'mist',
  },
  {
    id: 'evt-5',
    title: 'Weekend Design Exploration',
    date: format(addDays(monday, 5), 'yyyy-MM-dd'),
    startHour: 10,
    timeRange: '10:00 AM - 11:30 AM',
    category: 'personal',
    tone: 'sage',
  },
  {
    id: 'evt-6',
    title: 'Weekly Portfolio Retrospective',
    date: format(addDays(monday, 6), 'yyyy-MM-dd'),
    startHour: 11,
    timeRange: '11:00 AM - 12:00 PM',
    category: 'milestones',
    tone: 'pine',
  },
];
