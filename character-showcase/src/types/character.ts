export type CharacterCategory = 'All' | 'Vanguard' | 'Tactician' | 'Arcane';
export type LocaleLang = 'en' | 'id';
export interface LocalizedText { en: string; id: string; }
export interface CharacterLoadout { id: string; label: string; detail: LocalizedText; }
export interface AnimeInfo { title: string; image: string; synopsis: LocalizedText; studio: string; genre: LocalizedText; releaseYear: string; }
export interface CharacterItem {
  id: string; name: string; anime: string; role: LocalizedText;
  category: Exclude<CharacterCategory, 'All'>; codeName: string; themeColor: string;
  accentColor: string; image: string; lore: LocalizedText; animeInfo?: AnimeInfo;
  stats: { power: string; agility: string; origin: string; }; loadouts: CharacterLoadout[];
}
