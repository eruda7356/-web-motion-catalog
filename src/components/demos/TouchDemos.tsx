import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from 'react';
import { HelpCircle } from 'lucide-react';
import { HouseMotif, LeafMotif } from './shared';

interface TouchDemosProps {
  motionId: string;
  replayKey: number;
  disabled: boolean;
}

export function TouchDemos({ motionId, replayKey, disabled }: TouchDemosProps) {
  // 1. Hover Lift
  const [liftActive, setLiftActive] = useState(false);

  // 2. Animated Underline
  const [underlineActive, setUnderlineActive] = useState(false);

  // 3. Tooltip
  const [tooltipOpen, setTooltipOpen] = useState(false);

  // 4. 3D Tilt
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, active: false });
  const tiltTapStepRef = useRef(0);

  // 5. Magnetic Button
  const [magOffset, setMagOffset] = useState({ x: 0, y: 0 });

  // 6. Cursor Spotlight
  const [spot, setSpot] = useState({ x: 105, y: 48, visible: false });
  const spotTimerRef = useRef<number | null>(null);

  // 7. Ripple Effect
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const rippleBtnRef = useRef<HTMLButtonElement>(null);

  // Automatic demo playback when replay button is clicked (replayKey > 0)
  useEffect(() => {
    if (replayKey === 0) return;

    if (motionId === 'hover-lift') {
      setLiftActive(true);
      const t = window.setTimeout(() => setLiftActive(false), 1250);
      return () => window.clearTimeout(t);
    }

    if (motionId === 'animated-underline') {
      setUnderlineActive(false);
      const t1 = window.setTimeout(() => setUnderlineActive(true), 60);
      const t2 = window.setTimeout(() => setUnderlineActive(false), 1400);
      return () => {
        window.clearTimeout(t1);
        window.clearTimeout(t2);
      };
    }

    if (motionId === 'tooltip') {
      setTooltipOpen(true);
      const t = window.setTimeout(() => setTooltipOpen(false), 1650);
      return () => window.clearTimeout(t);
    }

    if (motionId === 'tilt-3d') {
      const start = performance.now();
      const duration = 1350;
      let frame = 0;
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        if (p < 1) {
          const angle = p * Math.PI * 2;
          const envelope = Math.sin(p * Math.PI);
          const ry = Math.cos(angle) * 12 * envelope;
          const rx = Math.sin(angle) * 10 * envelope;
          const gx = 50 + Math.cos(angle) * 32 * envelope;
          const gy = 50 - Math.sin(angle) * 28 * envelope;
          setTilt({ rx, ry, gx, gy, active: true });
          frame = requestAnimationFrame(tick);
        } else {
          setTilt({ rx: 0, ry: 0, gx: 50, gy: 50, active: false });
        }
      };
      frame = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(frame);
    }

    if (motionId === 'magnetic-button') {
      setMagOffset({ x: 14, y: -7 });
      const t1 = window.setTimeout(() => setMagOffset({ x: -12, y: 6 }), 420);
      const t2 = window.setTimeout(() => setMagOffset({ x: 0, y: 0 }), 860);
      return () => {
        window.clearTimeout(t1);
        window.clearTimeout(t2);
      };
    }

    if (motionId === 'cursor-spotlight') {
      const start = performance.now();
      const duration = 1300;
      let frame = 0;
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        if (p < 1) {
          const x = 24 + p * 168;
          const y = 46 + Math.sin(p * Math.PI * 2) * 16;
          setSpot({ x, y, visible: true });
          frame = requestAnimationFrame(tick);
        } else {
          setSpot((prev) => ({ ...prev, visible: false }));
        }
      };
      frame = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(frame);
    }

    if (motionId === 'ripple-effect') {
      const btn = rippleBtnRef.current;
      const x = btn ? btn.offsetWidth / 2 : 64;
      const y = btn ? btn.offsetHeight / 2 : 18;
      setRipples((prev) => [...prev.slice(-3), { id: Date.now(), x, y }]);
    }
  }, [motionId, replayKey]);

  useEffect(() => {
    return () => {
      if (spotTimerRef.current) window.clearTimeout(spotTimerRef.current);
    };
  }, []);

  const triggerRipple = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipples((prev) => [...prev.slice(-3), { id: Date.now(), x, y }]);
  };

  const handleTiltMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setTilt({
      rx: -ny * 11,
      ry: nx * 13,
      gx: ((e.clientX - rect.left) / rect.width) * 100,
      gy: ((e.clientY - rect.top) / rect.height) * 100,
      active: true,
    });
  };

  const handleTiltTap = () => {
    const presets = [
      { rx: -8, ry: 11, gx: 76, gy: 28, active: true },
      { rx: 8, ry: -10, gx: 26, gy: 74, active: true },
      { rx: 0, ry: 0, gx: 50, gy: 50, active: false },
    ];
    const next = presets[tiltTapStepRef.current % presets.length];
    tiltTapStepRef.current += 1;
    setTilt(next);
  };

  const handleSpotMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpot({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      visible: true,
    });
  };

  const handleSpotTap = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpot({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      visible: true,
    });
    if (spotTimerRef.current) window.clearTimeout(spotTimerRef.current);
    spotTimerRef.current = window.setTimeout(() => {
      setSpot((prev) => ({ ...prev, visible: false }));
    }, 1400);
  };

  switch (motionId) {
    case 'hover-lift':
      return (
        <>
          <button
            type="button"
            className={`demo-lift-card ${liftActive ? 'demo-lift-card--active' : ''}`}
            onClick={() => setLiftActive((v) => !v)}
            tabIndex={disabled ? -1 : 0}
          >
            <LeafMotif size={30} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-primary)' }}>
                春の便り
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>庭の草花のこと</div>
            </div>
          </button>
          <span className="demo-hint">乗せる・タップでふわっと浮きます</span>
        </>
      );

    case 'animated-underline':
      return (
        <>
          <div className="demo-underline-wrap">
            <button
              type="button"
              className={`demo-underline-link ${underlineActive ? 'demo-underline-link--active' : ''}`}
              onClick={() => setUnderlineActive((v) => !v)}
              tabIndex={disabled ? -1 : 0}
            >
              季節のお便りを読む →
            </button>
          </div>
          <span className="demo-hint">乗せる・タップで下線が伸びます</span>
        </>
      );

    case 'tooltip':
      return (
        <>
          <div
            className="demo-tooltip-wrap"
            onMouseEnter={() => setTooltipOpen(true)}
            onMouseLeave={() => setTooltipOpen(false)}
          >
            <div
              className={`demo-tooltip-bubble ${tooltipOpen ? 'demo-tooltip-bubble--open' : ''}`}
              role="tooltip"
            >
              水〜日曜 10:00〜17:00
            </div>
            <button
              type="button"
              className="demo-tooltip-trigger"
              onClick={() => setTooltipOpen((v) => !v)}
              tabIndex={disabled ? -1 : 0}
            >
              <HelpCircle size={13} />
              営業日のめやす
            </button>
          </div>
          <span className="demo-hint">乗せる・タップで補足が出ます</span>
        </>
      );

    case 'tilt-3d':
      return (
        <>
          <div
            className="demo-tilt-stage"
            onPointerMove={handleTiltMove}
            onPointerLeave={() => setTilt({ rx: 0, ry: 0, gx: 50, gy: 50, active: false })}
            onClick={handleTiltTap}
          >
            <div
              className="demo-tilt-card"
              style={{
                transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${tilt.active ? 1.03 : 1})`,
              }}
            >
              <div
                className="demo-tilt-card__sheen"
                style={{
                  opacity: tilt.active ? 1 : 0,
                  background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(255, 253, 249, 0.72), rgba(255, 253, 249, 0) 65%)`,
                }}
              />
              <HouseMotif />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-primary)' }}>
                  陽だまりの家
                </div>
                <div style={{ fontSize: 9.5, color: 'var(--text-secondary)' }}>
                  木のぬくもりと光
                </div>
              </div>
            </div>
          </div>
          <span className="demo-hint">動かす・タップで立体的に傾きます</span>
        </>
      );

    case 'magnetic-button':
      return (
        <>
          <div
            className="demo-magnetic-wrap"
            onPointerMove={(e) => {
              if (e.pointerType === 'touch') return;
              const rect = e.currentTarget.getBoundingClientRect();
              const dx = Math.max(-18, Math.min(18, (e.clientX - (rect.left + rect.width / 2)) * 0.28));
              const dy = Math.max(-12, Math.min(12, (e.clientY - (rect.top + rect.height / 2)) * 0.28));
              setMagOffset({ x: dx, y: dy });
            }}
            onPointerLeave={() => setMagOffset({ x: 0, y: 0 })}
          >
            <button
              type="button"
              className="demo-magnetic-btn"
              style={{ transform: `translate(${magOffset.x}px, ${magOffset.y}px)` }}
              onClick={() => {
                setMagOffset({ x: 10, y: -5 });
                window.setTimeout(() => setMagOffset({ x: 0, y: 0 }), 360);
              }}
              tabIndex={disabled ? -1 : 0}
            >
              ご予約はこちら
            </button>
          </div>
          <span className="demo-hint">近づける・タップで寄り添います</span>
        </>
      );

    case 'cursor-spotlight':
      return (
        <>
          <div
            className="demo-spotlight-card"
            onPointerMove={handleSpotMove}
            onPointerLeave={() => setSpot((prev) => ({ ...prev, visible: false }))}
            onClick={handleSpotTap}
          >
            <div
              className="demo-spotlight-glow"
              style={{
                opacity: spot.visible ? 1 : 0,
                background: `radial-gradient(96px circle at ${spot.x}px ${spot.y}px, rgba(238, 198, 156, 0.34), rgba(238, 198, 156, 0) 72%)`,
              }}
            />
            <div className="demo-spotlight-content">
              <span className="demo-spotlight-tag">NIGHT GALLERY</span>
              <div className="demo-spotlight-title">静かな灯りのアトリエ</div>
              <div className="demo-spotlight-sub">夕暮れからの小さな展示室</div>
            </div>
          </div>
          <span className="demo-hint">動かす・タップでほのかに光ります</span>
        </>
      );

    case 'ripple-effect':
      return (
        <>
          <button
            ref={rippleBtnRef}
            type="button"
            className="demo-ripple-btn"
            onClick={triggerRipple}
            tabIndex={disabled ? -1 : 0}
          >
            詳しく見てみる
            {ripples.map((r) => (
              <span
                key={r.id}
                className="demo-ripple-wave"
                style={{ left: r.x, top: r.y }}
              />
            ))}
          </button>
          <span className="demo-hint">押した位置から波紋が広がります</span>
        </>
      );

    default:
      return null;
  }
}
