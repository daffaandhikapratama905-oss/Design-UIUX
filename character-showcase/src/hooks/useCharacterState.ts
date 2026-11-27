import { useState, useMemo } from 'react';
import { DUMMY_CHARACTERS } from '../data/dummyCharacters';
import type { CharacterCategory } from '../types/character';

export function useCharacterState() {
  const [category, setCategory] = useState<CharacterCategory>('All');
  const [activeId, setActiveId] = useState<string>(DUMMY_CHARACTERS[0].id);
  const [inspectedId, setInspectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs'>('overview');
  const [selectedLoadout, setSelectedLoadout] = useState<string>('std');

  const filteredCharacters = useMemo(() => {
    if (category === 'All') return DUMMY_CHARACTERS;
    return DUMMY_CHARACTERS.filter((c) => c.category === category);
  }, [category]);

  const activeCharacter = useMemo(
    () =>
      filteredCharacters.find((c) => c.id === activeId) ??
      filteredCharacters[0] ??
      DUMMY_CHARACTERS[0],
    [filteredCharacters, activeId]
  );

  const inspectedCharacter = useMemo(
    () => DUMMY_CHARACTERS.find((c) => c.id === inspectedId) ?? null,
    [inspectedId]
  );

  const openInspect = (id: string) => {
    setActiveId(id);
    setInspectedId(id);
    setActiveTab('overview');
    setSelectedLoadout('std');
  };

  const closeInspect = () => {
    setInspectedId(null);
  };

  return {
    category,
    setCategory,
    filteredCharacters,
    activeCharacter,
    setActiveId,
    inspectedCharacter,
    openInspect,
    closeInspect,
    activeTab,
    setActiveTab,
    selectedLoadout,
    setSelectedLoadout,
  };
}