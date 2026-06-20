'use client';

import { Template } from '@/lib/templates';
import styles from './TemplatePicker.module.css';

interface Props {
  templates: Template[];
  selected: Template;
  onSelect: (t: Template) => void;
}

export default function TemplatePicker({ templates, selected, onSelect }: Props) {
  return (
    <div className={styles.wrapper}>
      <p className="label">Pilih Template ({templates.length} tersedia)</p>
      <div className={styles.grid}>
        {templates.map(t => (
          <button
            key={t.id}
            id={`template-${t.id}`}
            className={`${styles.card} ${selected.id === t.id ? styles.selected : ''}`}
            onClick={() => onSelect(t)}
            title={t.description}
          >
            {/* Preview thumbnail */}
            <div className={styles.preview} style={{ background: t.backgroundColor }}>
              <div
                className={(t.layout === 'strip' || t.layout === 'strip3') ? styles.previewStrip : styles.previewGrid}
                style={{ borderColor: t.frameColor }}
              >
                {(() => {
                  let totalSlots = t.photoCount;
                  if (t.layout === 'grid2x3') totalSlots = 6;
                  else if (t.layout === 'grid2x4') totalSlots = 8;
                  else if (t.layout === 'grid2x2') totalSlots = 4;
                  else if (t.layout === 'strip3') totalSlots = 3;
                  else if (t.layout === 'strip') totalSlots = 4;
                  
                  return Array.from({ length: totalSlots }).map((_, i) => (
                    <div key={i} className={styles.previewPhoto} style={{ background: t.frameColor + '33' }} />
                  ));
                })()}
              </div>
              {/* Color dots */}
              <div className={styles.colorDots}>
                <span style={{ background: t.frameColor }} />
                <span style={{ background: t.accentColor }} />
                <span style={{ background: t.textColor }} />
              </div>
            </div>
            <div className={styles.info}>
              <span className={styles.name}>{t.name}</span>
              <span className={styles.desc}>{t.description.slice(0, 30)}...</span>
            </div>
            {selected.id === t.id && (
              <div className={styles.checkmark}>✓</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
