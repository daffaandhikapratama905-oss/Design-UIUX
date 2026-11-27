import { useState } from 'react';
import type { LocaleLang } from './types/character';
import { useCharacterState } from './hooks/useCharacterState';
import { TopBar } from './components/TopBar';
import { CharacterCarousel } from './components/CharacterCarousel';
import { CharacterDetail } from './components/CharacterDetail';

export function App() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [lang, setLang] = useState<LocaleLang>('en');
  const {
    category,
    setCategory,
    filteredCharacters,
    inspectedCharacter,
    openInspect,
    closeInspect,
    activeTab,
    setActiveTab,
    selectedLoadout,
    setSelectedLoadout,
  } = useCharacterState();

  return (
    <main
      data-app="character-showcase"
      data-mode={inspectedCharacter ? 'detail' : 'carousel'}
    >
      <TopBar
        category={category}
        onSelectCategory={setCategory}
        isInspected={Boolean(inspectedCharacter)}
        onBack={closeInspect}
        lang={lang}
        onToggleLang={setLang}
      />

      {inspectedCharacter ? (
        <CharacterDetail
          character={inspectedCharacter}
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          selectedLoadout={selectedLoadout}
          onSelectLoadout={setSelectedLoadout}
          onClose={closeInspect}
          lang={lang}
        />
      ) : (
        <CharacterCarousel
          characters={filteredCharacters}
          activeId={hoveredId}
          onHoverChange={setHoveredId}
          onInspect={openInspect}
          lang={lang}
        />
      )}
    </main>
  );
}

export default App;
