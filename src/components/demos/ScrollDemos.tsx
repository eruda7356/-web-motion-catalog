import { useEffect, useRef, useState } from 'react';
import { HouseMotif, LeafMotif } from './shared';

interface ScrollDemosProps {
  motionId: string;
  replayKey: number;
  disabled: boolean;
}

const STORY_STEPS = [
  { label: '朝の仕込み', desc: 'やわらかな朝光の中で生地をこねる時間。', bg: '#E6EFE7', icon: 'leaf' as const },
  { label: '昼の食卓', desc: '焼きたての香りと湯気がテーブルに広がります。', bg: '#F4E8DD', icon: 'house' as const },
  { label: '夕べの灯り', desc: '窓の外が薄暗くなる頃、静かに一日を閉じます。', bg: '#EBE5EE', icon: 'leaf' as const },
];

export function ScrollDemos({ motionId, replayKey, disabled }: ScrollDemosProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoFrameRef = useRef<number | null>(null);
  const autoTimerRef = useRef<number | null>(null);

  const [scrollRatio, setScrollRatio] = useState(0);
  const [activeAnchor, setActiveAnchor] = useState(0);

  const cancelAutoScroll = () => {
    if (autoFrameRef.current !== null) {
      cancelAnimationFrame(autoFrameRef.current);
      autoFrameRef.current = null;
    }
    if (autoTimerRef.current !== null) {
      window.clearTimeout(autoTimerRef.current);
      autoTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => cancelAutoScroll();
  }, []);

  // Auto-scroll demo on replay button press (replayKey > 0)
  useEffect(() => {
    if (replayKey === 0) return;
    const el = scrollRef.current;
    if (!el) return;
    cancelAutoScroll();

    if (motionId === 'smooth-scroll') {
      el.scrollTop = 0;
      setActiveAnchor(0);
      autoTimerRef.current = window.setTimeout(() => {
        setActiveAnchor(1);
        el.scrollTo({ top: 96, behavior: 'smooth' });
        autoTimerRef.current = window.setTimeout(() => {
          setActiveAnchor(2);
          el.scrollTo({ top: 196, behavior: 'smooth' });
        }, 780);
      }, 180);
      return () => cancelAutoScroll();
    }

    el.scrollTop = 0;
    setScrollRatio(0);

    const maxScroll = Math.max(0, el.scrollHeight - el.clientHeight);
    if (maxScroll <= 0) return;

    const duration = 1900;
    const start = performance.now();

    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      // Ease-in-out cubic
      const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      el.scrollTop = eased * maxScroll;
      setScrollRatio(eased);

      if (p < 1) {
        autoFrameRef.current = requestAnimationFrame(step);
      } else {
        autoFrameRef.current = null;
      }
    };

    autoTimerRef.current = window.setTimeout(() => {
      autoFrameRef.current = requestAnimationFrame(step);
    }, 120);

    return () => cancelAutoScroll();
  }, [motionId, replayKey]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    const ratio = max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0;
    setScrollRatio(ratio);

    if (motionId === 'smooth-scroll') {
      if (el.scrollTop < 60) setActiveAnchor(0);
      else if (el.scrollTop < 150) setActiveAnchor(1);
      else setActiveAnchor(2);
    }
  };

  const scrollBoxEvents = {
    ref: scrollRef,
    onScroll: handleScroll,
    onWheel: cancelAutoScroll,
    onTouchStart: cancelAutoScroll,
  };

  switch (motionId) {
    case 'scroll-reveal': {
      const items = [
        { title: '朝露の庭', sub: 'やわらかな光を浴びて', threshold: 0.04 },
        { title: '木漏れ日の机', sub: '季節の手紙をしたためる', threshold: 0.34 },
        { title: '夕暮れの窓辺', sub: '温かいお茶でひと息', threshold: 0.64 },
      ];
      return (
        <div className="demo-scroll-stage">
          <div {...scrollBoxEvents} className="demo-scroll-box">
            <div className="demo-scroll-lead">下にスクロールすると現れます ↓</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 16 }}>
              {items.map((item) => {
                const visible = scrollRatio >= item.threshold;
                return (
                  <div
                    key={item.title}
                    className={`demo-reveal-card ${visible ? 'demo-reveal-card--visible' : ''}`}
                  >
                    <LeafMotif size={24} />
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600 }}>{item.title}</div>
                      <div style={{ fontSize: 9.5, color: 'var(--text-secondary)' }}>{item.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <span className="demo-hint">スクロールまたは再生でふわっと出現</span>
        </div>
      );
    }

    case 'sticky-header': {
      const compact = scrollRatio > 0.14;
      return (
        <div className="demo-scroll-stage">
          <div
            className={`demo-sticky-bar ${compact ? 'demo-sticky-bar--compact' : ''}`}
          >
            <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-primary)' }}>
              陽だまり茶屋
            </span>
            <span style={{ fontSize: 9.5, fontWeight: 600, color: 'var(--accent-sage)' }}>
              ご予約
            </span>
          </div>
          <div {...scrollBoxEvents} className="demo-scroll-box" style={{ paddingTop: 38 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 24 }}>
              <div style={{ background: '#E6EFE7', borderRadius: 10, padding: 12, fontSize: 10.5 }}>
                トップの案内エリア
              </div>
              <div style={{ background: '#FFFDF9', borderRadius: 10, padding: 12, fontSize: 10.5 }}>
                下に読み進めても上のバーがコンパクトに留まります
              </div>
              <div style={{ background: '#FFFDF9', borderRadius: 10, padding: 12, fontSize: 10.5 }}>
                いつでも予約ボタンに手が届きます
              </div>
            </div>
          </div>
          <span className="demo-hint">スクロールで上部バーが固定変化</span>
        </div>
      );
    }

    case 'smooth-scroll': {
      const sections = [
        { label: 'はじめに', top: 0, bg: '#E8F0E8', body: '森のほとりに佇む小さなアトリエのご案内です。' },
        { label: '暮らし', top: 96, bg: '#F5ECE2', body: '季節ごとの草花と手仕事の道具を揃えています。' },
        { label: 'アクセス', top: 196, bg: '#FFFDF9', body: '水〜日曜 10:00〜17:00・駐車場3台あり。' },
      ];
      return (
        <div className="demo-scroll-stage">
          <div className="demo-smooth-nav">
            {sections.map((sec, idx) => (
              <button
                key={sec.label}
                type="button"
                className={`demo-smooth-btn ${activeAnchor === idx ? 'demo-smooth-btn--active' : ''}`}
                onClick={() => {
                  cancelAutoScroll();
                  setActiveAnchor(idx);
                  scrollRef.current?.scrollTo({ top: sec.top, behavior: 'smooth' });
                }}
                tabIndex={disabled ? -1 : 0}
              >
                {sec.label}
              </button>
            ))}
          </div>
          <div {...scrollBoxEvents} className="demo-scroll-box" style={{ paddingTop: 34 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 30 }}>
              {sections.map((sec) => (
                <div
                  key={sec.label}
                  style={{
                    backgroundColor: sec.bg,
                    borderRadius: 10,
                    padding: '12px 12px',
                    minHeight: 84,
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 4 }}>{sec.label}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {sec.body}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <span className="demo-hint">目次ボタンを押すとするっと移動</span>
        </div>
      );
    }

    case 'parallax':
      return (
        <div className="demo-scroll-stage">
          <div {...scrollBoxEvents} className="demo-scroll-box">
            <div
              style={{
                height: 220,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <svg
                width="196"
                height="82"
                viewBox="0 0 196 82"
                style={{
                  transform: `translateY(${(scrollRatio - 0.35) * -22}px)`,
                  transition: 'transform 0.06s linear',
                }}
                aria-hidden="true"
              >
                <circle cx="148" cy="22" r="13" fill="#E9C9A8" />
                <path d="M0 74 Q50 32 104 58 T196 48 L196 82 L0 82 Z" fill="#D5E3D6" />
              </svg>
              <div
                style={{
                  background: 'rgba(255,253,249,0.94)',
                  padding: '7px 15px',
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 600,
                  marginTop: -24,
                  boxShadow: '0 4px 12px rgba(56, 49, 42, 0.08)',
                  transform: `translateY(${(scrollRatio - 0.35) * 16}px)`,
                }}
              >
                奥行きのある景色
              </div>
            </div>
          </div>
          <span className="demo-hint">スクロールで奥と手前が別速度で移動</span>
        </div>
      );

    case 'scrollytelling': {
      const stepIdx = scrollRatio < 0.33 ? 0 : scrollRatio < 0.68 ? 1 : 2;
      const current = STORY_STEPS[stepIdx];
      return (
        <div className="demo-scroll-stage demo-story-layout">
          <div className="demo-story-visual" style={{ backgroundColor: current.bg }}>
            <div key={stepIdx} className="demo-story-visual__inner">
              {current.icon === 'leaf' ? <LeafMotif size={28} /> : <HouseMotif />}
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-primary)' }}>
                {current.label}
              </span>
            </div>
          </div>
          <div {...scrollBoxEvents} className="demo-scroll-box demo-story-col">
            {STORY_STEPS.map((st, idx) => (
              <div
                key={st.label}
                className={`demo-story-chapter ${stepIdx === idx ? 'demo-story-chapter--active' : ''}`}
              >
                <div style={{ fontSize: 10, fontWeight: 700, marginBottom: 2 }}>{st.label}</div>
                <div style={{ fontSize: 9.5, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  {st.desc}
                </div>
              </div>
            ))}
          </div>
          <span className="demo-hint">右をスクロールすると左の図が変化</span>
        </div>
      );
    }

    case 'stacking-cards': {
      const stack = [
        { num: '1', title: '朝の焼きたてパン', bg: '#FFFDF9', top: 6 },
        { num: '2', title: '季節野菜のスープ', bg: '#E8F0E8', top: 14 },
        { num: '3', title: '午後の深煎り珈琲', bg: '#F5EAE0', top: 22 },
      ];
      return (
        <div className="demo-scroll-stage">
          <div {...scrollBoxEvents} className="demo-scroll-box">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 46, paddingBottom: 34 }}>
              {stack.map((card) => (
                <div
                  key={card.title}
                  className="demo-stack-card"
                  style={{ backgroundColor: card.bg, top: card.top }}
                >
                  <span className="demo-stack-card__badge">{card.num}</span>
                  <span style={{ fontSize: 11, fontWeight: 600 }}>{card.title}</span>
                </div>
              ))}
            </div>
          </div>
          <span className="demo-hint">スクロールでカードが順に重なります</span>
        </div>
      );
    }

    case 'bg-color-change': {
      const bg =
        scrollRatio < 0.34 ? '#E7EFE7' : scrollRatio < 0.7 ? '#F6EDE0' : '#EBE5EF';
      return (
        <div
          className="demo-scroll-stage"
          style={{ backgroundColor: bg, transition: 'background-color 0.55s ease' }}
        >
          <div {...scrollBoxEvents} className="demo-scroll-box">
            {[
              { title: '朝のセクション', desc: '澄んだセージの空気' },
              { title: '昼のセクション', desc: '日差しのような生成り色' },
              { title: '夕べのセクション', desc: '穏やかな薄紫の余韻' },
            ].map((sec) => (
              <div key={sec.title} className="demo-bgcolor-sec">
                <div style={{ fontSize: 11.5, fontWeight: 700 }}>{sec.title}</div>
                <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{sec.desc}</div>
              </div>
            ))}
          </div>
          <span className="demo-hint">スクロールで背景色が滑らかに移ろいます</span>
        </div>
      );
    }

    case 'scroll-progress':
      return (
        <div className="demo-scroll-stage">
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#E5DDD0', zIndex: 5 }}>
            <div
              style={{
                height: '100%',
                width: `${Math.max(8, scrollRatio * 100)}%`,
                background: 'var(--accent-sage)',
                transition: 'width 0.08s linear',
              }}
            />
          </div>
          <div {...scrollBoxEvents} className="demo-scroll-box">
            <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 6, marginTop: 4 }}>季節のコラム</div>
            <p style={{ fontSize: 10.5, color: 'var(--text-secondary)', margin: '0 0 10px' }}>
              朝の空気が少しずつ澄んできました。庭のハーブも元気よく葉を広げています。
            </p>
            <p style={{ fontSize: 10.5, color: 'var(--text-secondary)', margin: '0 0 10px' }}>
              お気に入りのカップにお茶を淹れて、窓辺でひと息つく時間。
            </p>
            <p style={{ fontSize: 10.5, color: 'var(--text-secondary)', margin: '0 0 10px' }}>
              やわらかな光がテーブルに落ちる様子を眺めていると、心がすっと落ち着きます。
            </p>
            <p style={{ fontSize: 10.5, color: 'var(--text-secondary)', margin: 0 }}>
              そんな毎日の小さな幸せを大切にしたいですね。
            </p>
          </div>
          <span className="demo-hint">スクロールで上の線が伸びます</span>
        </div>
      );

    case 'reveal-footer':
      return (
        <div className="demo-scroll-stage">
          <div {...scrollBoxEvents} className="demo-scroll-box" style={{ padding: 0 }}>
            <div className="demo-reveal-main">
              <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 6 }}>森の暮らしの本編</div>
              <p style={{ fontSize: 10, color: 'var(--text-secondary)', margin: '0 0 10px' }}>
                本文を最後まで読み進めると、紙がめくれるように背後のフッターが現れます。
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <LeafMotif size={24} />
                <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>季節のたよりをお読みいただきありがとうございました。</span>
              </div>
            </div>
            <div className="demo-reveal-footer-sheet">
              <div style={{ fontSize: 11, fontWeight: 700, color: '#FFFDF9' }}>森のアトリエ</div>
              <div style={{ fontSize: 9.5, color: '#D7CEC2' }}>営業時間 10:00〜17:00 ・ お問い合わせ</div>
            </div>
          </div>
          <span className="demo-hint">最後までスクロールするとフッターが出現</span>
        </div>
      );

    case 'multi-scroll': {
      const leftCols = [
        { label: '朝の葉', bg: '#E6EFE7' },
        { label: '庭の草', bg: '#FFFDF9' },
        { label: '木の机', bg: '#E6EFE7' },
      ];
      const rightCols = [
        { label: '珈琲杯', bg: '#F4E8DD' },
        { label: '窓の光', bg: '#FFFDF9' },
        { label: '夕の灯', bg: '#F4E8DD' },
      ];
      const travel = 112;
      return (
        <div className="demo-scroll-stage">
          <div className="demo-multi-visual" aria-hidden="true">
            <div
              className="demo-multi-col"
              style={{ transform: `translateY(${-scrollRatio * travel}px)` }}
            >
              {leftCols.map((c) => (
                <div key={c.label} className="demo-multi-tile" style={{ backgroundColor: c.bg }}>
                  {c.label}
                </div>
              ))}
            </div>
            <div
              className="demo-multi-col"
              style={{ transform: `translateY(${-(1 - scrollRatio) * travel}px)` }}
            >
              {rightCols.map((c) => (
                <div key={c.label} className="demo-multi-tile" style={{ backgroundColor: c.bg }}>
                  {c.label}
                </div>
              ))}
            </div>
          </div>
          {/* Transparent scroll driver */}
          <div {...scrollBoxEvents} className="demo-multi-driver">
            <div style={{ height: 280 }} />
          </div>
          <span className="demo-hint">スクロールで左右が逆向きに流れます</span>
        </div>
      );
    }

    default:
      return null;
  }
}
