import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Shield, Zap, MapPin, ExternalLink, BookOpen, AtSign } from 'lucide-react';
import type { CharacterItem, LocaleLang } from '../types/character';
import { getCharacterVars } from '../utils/themeHelpers';

interface CharacterDetailProps {
  character: CharacterItem;
  activeTab: 'overview' | 'specs';
  onChangeTab: (tab: 'overview' | 'specs') => void;
  selectedLoadout: string;
  onSelectLoadout: (id: string) => void;
  onClose: () => void;
  lang: LocaleLang;
}

const MAL_URL = 'https://myanimelist.net/anime/64452/Koisuru_Otome_no_Tsukurikata';
const AUTHOR_IG_URL = 'https://www.instagram.com/azusa_banjo?jplx=ZDNlZDc0MzIxNw==';

export function CharacterDetail({
  character,
  activeTab,
  onChangeTab,
  selectedLoadout,
  onSelectLoadout,
  onClose,
  lang,
}: CharacterDetailProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  const loadouts = character.loadouts ?? [];
  const currentLoadout =
    loadouts.find((l) => l.id === selectedLoadout) ??
    loadouts[0] ?? {
      id: 'std',
      label: 'Default',
      detail: { en: 'Standard gear', id: 'Perlengkapan standar' },
    };

  const animeInfo = character.animeInfo ?? {
    title: character.anime,
    image: character.image,
    synopsis: character.lore,
    studio: 'Studio Archive',
    genre: { en: character.category, id: character.category },
    releaseYear: '2026',
  };

  const stats = character.stats ?? {
    power: 'S-Rank',
    agility: '90 / 100',
    origin: 'Unknown',
  };

  const isSpecs = activeTab === 'specs';
  const heroSrc = isSpecs ? animeInfo.image : character.image;
  const heroAlt = isSpecs ? `${animeInfo.title} visual` : character.name;

  useEffect(() => {
    setImgLoaded(false);
    setParallax({ x: 0, y: 0 });
  }, [activeTab, character.id]);

  useEffect(() => {
    if (isSpecs) {
      setParallax({ x: 0, y: 0 });
      return;
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      const clampedX = Math.max(-25, Math.min(25, e.gamma)) / 25;
      const clampedY = Math.max(-25, Math.min(25, e.beta - 45)) / 25;
      setParallax({ x: clampedX, y: clampedY });
    };

    const requestIosGyroIfNeeded = async () => {
      const devOrientation = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<'granted' | 'denied'>;
      };
      if (typeof devOrientation?.requestPermission === 'function') {
        try {
          const state = await devOrientation.requestPermission();
          if (state === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          }
        } catch {
          // Ignore if permission denied or unsupported
        }
      } else {
        window.addEventListener('deviceorientation', handleOrientation);
      }
    };

    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
      void requestIosGyroIfNeeded();
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [isSpecs]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isSpecs || e.pointerType !== 'mouse') return;
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return;
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setParallax({ x: nx, y: ny });
  };

  const handlePointerLeave = () => {
    if (!isSpecs) setParallax({ x: 0, y: 0 });
  };

  const parallaxStyle = !isSpecs
    ? {
        transform: `translate3d(${(parallax.x * 18).toFixed(1)}px, ${(parallax.y * 14).toFixed(1)}px, 0) rotateX(${(-parallax.y * 6).toFixed(1)}deg) rotateY(${(parallax.x * 8).toFixed(1)}deg) scale(1.06)`,
      }
    : undefined;

  const t = {
    back: lang === 'en' ? 'Back' : 'Kembali',
    overview: 'Overview',
    specs: 'Specs',
    heroKickerChar: lang === 'en' ? 'ANIME CHARACTER' : 'KARAKTER ANIME',
    heroKickerAnime: lang === 'en' ? 'ANIME ORIGIN VISUAL' : 'VISUAL ANIME ASAL',
    characterPrefix: lang === 'en' ? 'Character' : 'Karakter',
    lore: character.lore[lang],
    role: character.role[lang],
    loadoutDetail: currentLoadout.detail[lang],
    synopsis: animeInfo.synopsis[lang],
    genre: animeInfo.genre[lang],
    presetLegend: lang === 'en' ? 'Equipment Preset' : 'Preset Perlengkapan',
    sourceTag: lang === 'en' ? 'ANIME SOURCE & SPECS' : 'SUMBER ANIME & SPESIFIKASI',
    animeTitle: lang === 'en' ? 'Anime Title' : 'Judul Anime',
    genreYear: lang === 'en' ? 'Genre & Year' : 'Genre & Tahun',
    studio: lang === 'en' ? 'Production / Studio' : 'Produksi / Studio',
    combatRating: lang === 'en' ? 'Serialization' : 'Serialisasi',
    mobilityIndex: lang === 'en' ? 'Magazine / Publisher' : 'Majalah / Penerbit',
    origin: lang === 'en' ? 'Creator / IG' : 'Kreator / IG',
    refBtn: lang === 'en' ? 'Reference' : 'Referensi',
    igBtn: lang === 'en' ? 'Creator IG' : 'IG Komikus',
  };

  return (
    <article
      data-stage="detail"
      data-tab={activeTab}
      style={getCharacterVars(character)}
      aria-label={`${character.name} details`}
    >
      <aside data-detail-hero>
        <header data-hero-head-stack>
          <div>
            <small data-hero-sub>
              {isSpecs ? `${t.genre}, ${animeInfo.releaseYear}` : t.role}
            </small>  
            <h1>{isSpecs ? animeInfo.title : character.name}</h1>
          </div>

          <nav data-detail-tabs aria-label="Character tabs">
            <button
              type="button"
              data-active={!isSpecs}
              onClick={() => onChangeTab('overview')}
            >
              {t.overview}
            </button>
            <button
              type="button"
              data-active={isSpecs}
              onClick={() => onChangeTab('specs')}
            >
              {t.specs}
            </button>
          </nav>
        </header>

        <div
          ref={heroRef}
          data-parallax-stage
          data-parallax={!isSpecs}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <figure data-hero-portrait key={activeTab} style={parallaxStyle}>
            <img
              src={heroSrc}
              alt={heroAlt}
              loading="eager"
              style={{ display: imgLoaded ? 'block' : 'none' }}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgLoaded(false)}
            />
            {!imgLoaded && (
              <figcaption data-placeholder="light">
                <span>{isSpecs ? animeInfo.title : character.codeName}</span>
                <small>
                  {isSpecs ? `public${animeInfo.image}` : `public${character.image}`}
                </small>
              </figcaption>
            )}
          </figure>
        </div>

        <footer data-hero-foot>
          <div>
            <p>{isSpecs ? `${t.characterPrefix}: ${character.name}` : character.anime}</p>
            <small data-hero-sub>
              {isSpecs ? `${t.genre} • ${animeInfo.releaseYear}` : t.role}
            </small>
          </div>
        </footer>
      </aside>

      <section data-detail-panel>
        <button type="button" data-back-link onClick={onClose}>
          <ArrowLeft size={16} strokeWidth={2.2} />
          <span>{t.back}</span>
        </button>

        {!isSpecs ? (
          <>
            <header data-panel-head>
              <small data-panel-tag>
                {character.anime}, {t.role}
              </small>
              <h2>{character.name}</h2>
            </header>

            <section data-tab-body>
              <p data-lore>{t.lore}</p>

              <fieldset data-loadout-picker>
                <legend>{t.presetLegend}</legend>
                <menu>
                  {loadouts.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        data-active={selectedLoadout === item.id}
                        onClick={() => onSelectLoadout(item.id)}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </menu>
                <p data-loadout-desc>{t.loadoutDetail}</p>
              </fieldset>
            </section>
          </>
        ) : (
          <>
            <header data-panel-head>
              <small data-panel-tag>{t.sourceTag}</small>
              <h2>{animeInfo.title}</h2>
            </header>

            <section data-tab-body>
              <p data-lore>{t.synopsis}</p>

              <dl data-stats-list>
                <dt>{t.animeTitle}</dt>
                <dd>{animeInfo.title}</dd>

                <dt>{t.genreYear}</dt>
                <dd>
                  {t.genre} ({animeInfo.releaseYear})
                </dd>

                <dt>{t.studio}</dt>
                <dd>{animeInfo.studio}</dd>

                <dt>
                  <Zap size={15} /> {t.combatRating}
                </dt>
                <dd>{stats.power}</dd>

                <dt>
                  <Shield size={15} /> {t.mobilityIndex}
                </dt>
                <dd>{stats.agility}</dd>

                <dt>
                  <MapPin size={15} /> {t.origin}
                </dt>
                <dd>{stats.origin}</dd>
              </dl>

              {character.id === 'char-01' && (
                <div data-action-row>
                  <a
                    href={MAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-ref-btn
                  >
                    <BookOpen size={15} strokeWidth={2.2} />
                    <span>{t.refBtn}</span>
                    <ExternalLink size={13} strokeWidth={2.2} />
                  </a>
                  <a
                    href={AUTHOR_IG_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-ref-btn
                  >
                    <AtSign size={15} strokeWidth={2.2} />
                    <span>{t.igBtn}</span>
                    <ExternalLink size={13} strokeWidth={2.2} />
                  </a>
                </div>
              )}
            </section>
          </>
        )}
      </section>
    </article>
  );
}
