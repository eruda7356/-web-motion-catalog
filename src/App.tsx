import { useMemo, useRef, useState } from 'react';
import { BookOpen, Wrench } from 'lucide-react';
import { CATEGORIES, MOTIONS } from './data/motions';
import type { CategoryId, GlossaryTermId } from './types/motion';
import { SlidingTabs } from './components/SlidingTabs';
import { MotionCard } from './components/MotionCard';
import { FloatingBar } from './components/FloatingBar';
import { SiteAnatomyModal } from './components/SiteAnatomyModal';
import { DeveloperBoxModal } from './components/DeveloperBoxModal';
import './App.css';

export function App() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useRef<number | null>(null);

  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [activeTermId, setActiveTermId] = useState<GlossaryTermId>('header');

  const [devBoxOpen, setDevBoxOpen] = useState(false);
  const [developerMode, setDeveloperMode] = useState(false);

  const filteredMotions = useMemo(() => {
    if (activeCategory === 'all') return MOTIONS;
    return MOTIONS.filter((m) => m.category === activeCategory);
  }, [activeCategory]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleOpenGlossary = (termId?: GlossaryTermId) => {
    if (termId) {
      setActiveTermId(termId);
    }
    setGlossaryOpen(true);
  };

  const showToast = () => {
    setToastVisible(true);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastVisible(false);
    }, 2600);
  };

  const handleCopy = async () => {
    const selectedMotions = MOTIONS.filter((m) => selectedIds.includes(m.id));
    if (selectedMotions.length === 0) return;

    const lines = [
      '【Webの動き見本帳｜気になった動き】',
      ...selectedMotions.map((m) => `・${m.jaName}（${m.enName}）`),
    ];
    const text = lines.join('\n');

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    showToast();
  };

  return (
    <div className="catalog-page">
      <div className="catalog-container">
        <header className="catalog-header">
          <div className="catalog-header__top">
            <div className="catalog-title-group">
              <h1 className="catalog-title">Webの動き見本帳</h1>
              <p className="catalog-guide">
                気になる動きの「★」を押して選ぶと、画面下のボタンから一覧をコピーできます。そのままLINEやメールに貼り付けてお送りください。
              </p>
            </div>
            <button
              type="button"
              className="catalog-anatomy-btn"
              onClick={() => handleOpenGlossary()}
            >
              <BookOpen size={16} />
              サイトの仕組み・場所の名前を見る
            </button>
          </div>

          <SlidingTabs
            categories={CATEGORIES}
            activeId={activeCategory}
            onChange={setActiveCategory}
          />
        </header>

        <main>
          <section className="catalog-grid" aria-label="Webの動き一覧">
            {filteredMotions.map((motion) => (
              <MotionCard
                key={motion.id}
                motion={motion}
                isSelected={selectedIds.includes(motion.id)}
                developerMode={developerMode}
                onToggleSelect={toggleSelect}
                onOpenGlossary={handleOpenGlossary}
              />
            ))}
          </section>
        </main>

        <footer className="catalog-footer">
          <button
            type="button"
            className="catalog-devbox-btn"
            onClick={() => setDevBoxOpen(true)}
          >
            <Wrench size={11} />
            開発者BOX
          </button>
        </footer>
      </div>

      <FloatingBar
        count={selectedIds.length}
        onCopy={handleCopy}
        onClear={() => setSelectedIds([])}
        toastVisible={toastVisible}
      />

      <SiteAnatomyModal
        isOpen={glossaryOpen}
        activeTermId={activeTermId}
        onSelectTerm={setActiveTermId}
        onClose={() => setGlossaryOpen(false)}
      />

      <DeveloperBoxModal
        isOpen={devBoxOpen}
        developerMode={developerMode}
        onToggleDeveloperMode={() => setDeveloperMode((v) => !v)}
        onClose={() => setDevBoxOpen(false)}
      />
    </div>
  );
}

export default App;
