export type EventCategory = 'meetings' | 'tasks' | 'milestones' | 'personal';
export type HolstTone = 'pine' | 'sage' | 'mist' | 'sand';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  startHour: number;
  timeRange: string;
  category: EventCategory;
  tone: HolstTone;
}
