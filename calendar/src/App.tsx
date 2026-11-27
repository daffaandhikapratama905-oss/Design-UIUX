import { useState } from 'react';
import { useLocalEvents } from './hooks/useLocalEvents';
import type { EventCategory } from './types/calendar';
import { TopBar } from './components/TopBar';
import { BentoRail } from './components/BentoRail';
import { WeeklyGrid } from './components/WeeklyGrid';
import { EventModal } from './components/EventModal';

export function App() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategories, setActiveCategories] = useState<EventCategory[]>([
    'meetings',
    'tasks',
    'milestones',
    'personal',
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { events, addEvent, deleteEvent } = useLocalEvents();

  const toggleCategory = (cat: EventCategory) => {
    setActiveCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const filteredEvents = events.filter(
    (e) =>
      activeCategories.includes(e.category) &&
      e.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main data-app="calendar-bento">
      <TopBar
        selectedDate={selectedDate}
        onChangeDate={setSelectedDate}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategories={activeCategories}
        onToggleCategory={toggleCategory}
        onOpenCreate={() => setIsModalOpen(true)}
      />

      <section data-bento="workspace">
        <BentoRail
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          nextEvent={filteredEvents[0]}
        />
        <WeeklyGrid
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          events={filteredEvents}
          onDeleteEvent={deleteEvent}
        />
      </section>

      <EventModal
        isOpen={isModalOpen}
        defaultDate={selectedDate}
        onClose={() => setIsModalOpen(false)}
        onSave={addEvent}
      />
    </main>
  );
}

export default App;
