import { Sparkles } from 'lucide-react';
import type { CharacterCategory, LocaleLang } from '../types/character';

interface TopBarProps {
  category: CharacterCategory;
  onSelectCategory: (cat: CharacterCategory) => void;
  isInspected: boolean;
  onBack: () => void;
  lang: LocaleLang;
  onToggleLang: (lang: LocaleLang) => void;
}

const CATEGORIES: CharacterCategory[] = ['All', 'Vanguard', 'Tactician', 'Arcane'];

export function TopBar({
  category,
  onSelectCategory,
  isInspected,
  onBack,
  lang,
  onToggleLang,
}: TopBarProps) {
  return (
    <header data-topbar>
      <a
        href="#top"
        data-brand
        onClick={(e) => {
          e.preventDefault();
          onBack();
        }}
      >
        <Sparkles size={18} strokeWidth={2.2} />
        <strong>CHARACTER ARCHIVE</strong>
      </a>

      <div data-topbar-right>
        {!isInspected && (
          <nav aria-label="Character roles">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                data-nav-tab
                data-active={category === cat}
                onClick={() => onSelectCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </nav>
        )}

        <div data-lang-pill role="group" aria-label="Language switch">
          <button
            type="button"
            data-lang-btn
            data-active={lang === 'en'}
            onClick={() => onToggleLang('en')}
          >
            EN
          </button>
          <button
            type="button"
            data-lang-btn
            data-active={lang === 'id'}
            onClick={() => onToggleLang('id')}
          >
            ID
          </button>
        </div>
      </div>
    </header>
  );
}
