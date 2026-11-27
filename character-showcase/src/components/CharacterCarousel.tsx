import { useRef, useEffect } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import type { CharacterItem } from '../types/character';
import { getCharacterVars } from '../utils/themeHelpers';

export type CarouselLang = 'en' | 'id';

interface CharacterCarouselProps {
  characters: CharacterItem[];
  activeId: string | null;
  onHoverChange: (id: string | null) => void;
  onInspect: (id: string) => void;
  lang?: CarouselLang;
}

function resolveText(value: unknown, lang: CarouselLang): string {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') {
    const rec = value as Record<string, unknown>;
    const picked = rec[lang] ?? rec.en ?? rec.id;
    if (typeof picked === 'string') return picked;
  }
  return '';
}

function smoothScrollLeft(el: HTMLElement, targetLeft: number, duration = 420) {
  const startLeft = el.scrollLeft;
  const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
  const clampedTarget = Math.min(maxScroll, Math.max(0, targetLeft));
  const delta = clampedTarget - startLeft;
  if (Math.abs(delta) < 1) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    el.scrollLeft = clampedTarget;
    return;
  }

  const startTime = performance.now();
  const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

  const step = (now: number) => {
    const progress = Math.min(1, (now - startTime) / duration);
    el.scrollLeft = startLeft + delta * easeOutQuart(progress);
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

export function CharacterCarousel({
  characters,
  activeId,
  onHoverChange,
  onInspect,
  lang = 'en',
}: CharacterCarouselProps) {
  const trackRef = useRef<HTMLOListElement>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const isDesktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const onWheel = (e: WheelEvent) => {
      if (!isDesktopPointer.matches) return;
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY * 0.9;
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const centerCharacterByStep = (dir: -1 | 1) => {
    const track = trackRef.current;
    const cards = cardRefs.current.filter((c): c is HTMLLIElement => Boolean(c));
    if (!track || cards.length === 0) return;

    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    let closestIdx = 0;
    let bestDist = Infinity;

    cards.forEach((card, idx) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(cardCenter - trackCenter);
      if (dist < bestDist) {
        bestDist = dist;
        closestIdx = idx;
      }
    });

    const targetIdx = Math.min(cards.length - 1, Math.max(0, closestIdx + dir));
    const targetCard = cards[targetIdx];
    const targetScrollLeft =
      targetCard.offsetLeft - (track.clientWidth - targetCard.offsetWidth) / 2;

    onHoverChange(characters[targetIdx]?.id ?? null);
    smoothScrollLeft(track, targetScrollLeft, 440);
  };

  return (
    <section data-stage="carousel" aria-label="Anime character showcase">
      <header data-stage-head>
        <h1>Anime Characters</h1>
      </header>

      {characters.length === 0 ? (
        <p data-empty-state>
          {lang === 'id' ? 'Belum ada karakter di kategori ini.' : 'No characters in this category.'}
        </p>
      ) : (
        <ol ref={trackRef} data-track onMouseLeave={() => onHoverChange(null)}>
          {characters.map((char, idx) => {
            const isActive = char.id === activeId;
            const charName = resolveText(char.name, lang);
            return (
              <li
                key={char.id}
                ref={(node) => {
                  cardRefs.current[idx] = node;
                }}
                data-slice
                data-active={isActive}
                style={getCharacterVars(char)}
                onMouseEnter={() => onHoverChange(char.id)}
                onClick={() => onInspect(char.id)}
              >
                <header data-card-top>
                  <h2>{charName}</h2>
                </header>
                <figure data-portrait>
                  <img
                    src={char.image}
                    alt={charName}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </figure>
                <footer data-card-bottom>
                  <p>{resolveText(char.anime, lang)}</p>
                  <button
                    type="button"
                    data-plus-btn
                    aria-label={`Inspect ${charName}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onInspect(char.id);
                    }}
                  >
                    <Plus size={18} strokeWidth={1.75} aria-hidden="true" />
                  </button>
                </footer>
              </li>
            );
          })}
        </ol>
      )}

      <nav data-carousel-controls aria-label="Scroll roster">
        <button
          type="button"
          data-arrow-btn
          aria-label="Center previous character"
          onClick={() => centerCharacterByStep(-1)}
        >
          <ChevronLeft size={18} strokeWidth={2.2} aria-hidden="true" />
        </button>
        <button
          type="button"
          data-arrow-btn
          aria-label="Center next character"
          onClick={() => centerCharacterByStep(1)}
        >
          <ChevronRight size={18} strokeWidth={2.2} aria-hidden="true" />
        </button>
      </nav>
    </section>
  );
}