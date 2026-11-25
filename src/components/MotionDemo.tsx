import { useState, type MouseEvent } from 'react';
import { RotateCcw } from 'lucide-react';
import { OpeningDemo } from './demos/OpeningDemos';
import { TouchDemos } from './demos/TouchDemos';
import { ToggleDemos } from './demos/ToggleDemos';
import { ScrollDemos } from './demos/ScrollDemos';
import { TextDemos } from './demos/TextDemos';
import { AtmosphereDemos } from './demos/AtmosphereDemos';
import { FeedbackDemos } from './demos/FeedbackDemos';
import './MotionDemo.css';

interface MotionDemoProps {
  motionId: string;
  category: string;
  disabled?: boolean;
}

export function MotionDemo({ motionId, category, disabled = false }: MotionDemoProps) {
  const [replayKey, setReplayKey] = useState(0);

  const handleReplay = (e: MouseEvent) => {
    e.stopPropagation();
    setReplayKey((k) => k + 1);
  };

  const renderCategoryDemo = () => {
    switch (category) {
      case 'opening':
        return <OpeningDemo motionId={motionId} replayKey={replayKey} />;
      case 'touch':
        return <TouchDemos motionId={motionId} replayKey={replayKey} disabled={disabled} />;
      case 'toggle':
        return <ToggleDemos motionId={motionId} replayKey={replayKey} disabled={disabled} />;
      case 'scroll':
        return <ScrollDemos motionId={motionId} replayKey={replayKey} disabled={disabled} />;
      case 'typography':
        return <TextDemos motionId={motionId} replayKey={replayKey} disabled={disabled} />;
      case 'atmosphere':
        return <AtmosphereDemos motionId={motionId} replayKey={replayKey} disabled={disabled} />;
      case 'feedback':
        return <FeedbackDemos motionId={motionId} replayKey={replayKey} disabled={disabled} />;
      default:
        return null;
    }
  };

  return (
    <div className={`mini-browser ${disabled ? 'mini-browser--disabled' : ''}`} aria-hidden={disabled}>
      <div className="mini-browser__bar">
        <div className="mini-browser__dots">
          <span className="mini-browser__dot" />
          <span className="mini-browser__dot" />
          <span className="mini-browser__dot" />
        </div>
      </div>
      <button
        type="button"
        className="mini-browser__replay"
        onClick={handleReplay}
        title="もう一度再生する"
        aria-label="もう一度再生する"
        tabIndex={disabled ? -1 : 0}
      >
        <RotateCcw size={13} />
      </button>
      <div className="mini-browser__stage">{renderCategoryDemo()}</div>
    </div>
  );
}
