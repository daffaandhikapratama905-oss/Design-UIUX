import type { CSSProperties } from 'react';
import type { CharacterItem } from '../types/character';

export function getCharacterVars(char: CharacterItem): CSSProperties {
  return {
    '--char-theme': char.themeColor,
    '--char-accent': char.accentColor,
  } as CSSProperties;
}