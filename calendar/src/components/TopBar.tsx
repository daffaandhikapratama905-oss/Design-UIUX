import { format, addDays, subDays } from 'date-fns';
import { Search, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import type { EventCategory } from '../types/calendar';

interface TopBarProps {
  selectedDate: Date;
  onChangeDate: (date: Date) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeCategories: EventCategory[];
  onToggleCategory: (cat: EventCategory) => void;
  onOpenCreate: () => void;
}

const CATEGORIES: { id: EventCategory; label: string }[] = [
  { id: 'meetings', label: 'Meetings' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'milestones', label: 'Milestones' },
  { id: 'personal', label: 'Personal' },
];

export function TopBar({
  selectedDate,
  onChangeDate,
  searchQuery,
  onSearchChange,
  activeCategories,
  onToggleCategory,
  onOpenCreate,
}: TopBarProps) {
  return (
    <header data-bento="topbar">
      <nav aria-label="Date navigation">
        <button
          type="button"
          data-btn="icon"
          aria-label="Previous day"
          onClick={() => onChangeDate(subDays(selectedDate, 1))}
        >
          <ChevronLeft size={16} strokeWidth={2} />
        </button>
        <h1 key={selectedDate.toISOString()}>{format(selectedDate, 'MMM d, yyyy')}</h1>
        <button
          type="button"
          data-btn="icon"
          aria-label="Next day"
          onClick={() => onChangeDate(addDays(selectedDate, 1))}
        >
          <ChevronRight size={16} strokeWidth={2} />
        </button>
      </nav>

      <button type="button" data-btn="primary" onClick={onOpenCreate}>
        <Plus size={15} strokeWidth={2.2} />
        <span>New Event</span>
      </button>

      <menu aria-label="Filters and search">
        <li>
          <ul data-filter-strip>
            {CATEGORIES.map((cat) => (
              <li key={cat.id}>
                <button
                  type="button"
                  data-chip
                  data-active={activeCategories.includes(cat.id)}
                  onClick={() => onToggleCategory(cat.id)}
                >
                  {cat.label}
                </button>
              </li>
            ))}
          </ul>
        </li>

        <li>
          <label data-search>
            <Search size={14} strokeWidth={2} />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search events..."
            />
          </label>
        </li>
      </menu>
    </header>
  );
}
