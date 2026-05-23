'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Stage, Layer, Rect, Group, Text, Transformer, Image as KonvaImage } from 'react-konva';
import styles from './AdminLayoutEditor.module.css';

export interface AdminPhotoSlot {
  id: string;
  photoIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  imageScale: number;
  imageX: number;
  imageY: number;
}

interface Props {
  initialSlotsJson?: string;
  aspectRatio: string;
  setAspectRatio: (ratio: string) => void;
  layout: 'strip' | 'grid2x2' | 'grid3x2' | 'single' | 'strip3' | 'grid';
  setLayout: (layout: any) => void;
  photoCount: number;
  frameColor: string;
  backgroundColor: string;
  frameWidth: number;
  overlayImage?: string;
  onSave: (slotsJson: string) => void;
  onClose: () => void;
}

function useCanvasImage(src?: string) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
    if (!src) {
      setImg(null);
      return;
    }
    const image = new window.Image();
    image.crossOrigin = 'anonymous';
    image.src = src;
    image.onload = () => setImg(image);
    image.onerror = () => setImg(null);
  }, [src]);
  return img;
}

function getInitialSlots(
  ratio: string,
  layoutType: string,
  photoCount: number,
  padding: number
): AdminPhotoSlot[] {
  let w = 1200;
  let h = 1800;
  if (ratio === '1:3') {
    w = 600;
    h = 1800;
  } else if (ratio === '1:1') {
    w = 1200;
    h = 1200;
  } else if (ratio === '3:4') {
    w = 1200;
    h = 1600;
  }

  const slots: AdminPhotoSlot[] = [];
  const FOOTER_H = 150;
  const usableHeight = h - FOOTER_H;

  if (layoutType === 'strip' || layoutType === 'strip3' || (ratio === '1:3' && layoutType !== 'grid2x2' && layoutType !== 'grid3x2')) {
    const count = layoutType === 'strip' ? 4 : (layoutType === 'strip3' ? 3 : 4);
    const sideMargin = padding * 1.5;
    const slotW = w - sideMargin * 2;
    const totalGaps = (count - 1) * padding;
    const slotH = (usableHeight - padding * 2 - totalGaps) / count;

    for (let i = 0; i < count; i++) {
      slots.push({
        id: `slot-${i}`,
        photoIndex: i % Math.max(1, photoCount),
        x: sideMargin,
        y: padding + i * (slotH + padding),
        width: slotW,
        height: slotH,
        imageScale: 1,
        imageX: 0,
        imageY: 0
      });
    }
  } else if (layoutType === 'grid2x2' || (layoutType === 'grid' && photoCount <= 4)) {
    const rows = 2;
    const cols = 2;
    const sideMargin = padding * 1.5;
    const totalW = w - sideMargin * 2;
    const slotW = (totalW - padding) / cols;
    const slotH = (usableHeight - padding * 2 - padding) / rows;

    for (let i = 0; i < 4; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      slots.push({
        id: `slot-${i}`,
        photoIndex: i % Math.max(1, photoCount),
        x: sideMargin + col * (slotW + padding),
        y: padding + row * (slotH + padding),
        width: slotW,
        height: slotH,
        imageScale: 1,
        imageX: 0,
        imageY: 0
      });
    }
  } else if (layoutType === 'grid3x2' || layoutType === 'grid') {
    const rows = 3;
    const cols = 2;
    const sideMargin = padding * 1.5;
    const totalW = w - sideMargin * 2;
    const slotW = (totalW - padding) / cols;
    const slotH = (usableHeight - padding * 2 - padding * 2) / rows;

    for (let i = 0; i < 6; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      slots.push({
        id: `slot-${i}`,
        photoIndex: i % Math.max(1, photoCount),
        x: sideMargin + col * (slotW + padding),
        y: padding + row * (slotH + padding),
        width: slotW,
        height: slotH,
        imageScale: 1,
        imageX: 0,
        imageY: 0
      });
    }
  } else {
    // single
    const sideMargin = padding * 1.5;
    const slotW = w - sideMargin * 2;
    const slotH = usableHeight - padding * 2;
    slots.push({
      id: `slot-0`,
      photoIndex: 0,
      x: sideMargin,
      y: padding,
      width: slotW,
      height: slotH,
      imageScale: 1,
      imageX: 0,
      imageY: 0
    });
  }

  return slots;
}

export default function AdminLayoutEditor({
  initialSlotsJson,
  aspectRatio,
  setAspectRatio,
  layout,
  setLayout,
  photoCount,
  frameColor,
  backgroundColor,
  frameWidth,
  overlayImage,
  onSave,
  onClose
}: Props) {
  const [slots, setSlots] = useState<AdminPhotoSlot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [scaleFactor, setScaleFactor] = useState(1);
  
  const stageRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  let virtualWidth = 1200;
  let virtualHeight = 1800;

  if (aspectRatio === '1:3') {
    virtualWidth = 600;
    virtualHeight = 1800;
  } else if (aspectRatio === '1:1') {
    virtualWidth = 1200;
    virtualHeight = 1200;
  } else if (aspectRatio === '3:4') {
    virtualWidth = 1200;
    virtualHeight = 1600;
  }

  // Load overlay image
  const overlayUrl = overlayImage
    ? (overlayImage.startsWith('http') ? overlayImage : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}${overlayImage}`)
    : undefined;
  const overlayImg = useCanvasImage(overlayUrl);

  // Initialize slots only once on mount
  const hasInitializedRef = useRef(false);
  useEffect(() => {
    if (!hasInitializedRef.current) {
      if (initialSlotsJson) {
        try {
          setSlots(JSON.parse(initialSlotsJson));
          hasInitializedRef.current = true;
          return;
        } catch (e) {
          console.error(e);
        }
      }
      setSlots(getInitialSlots(aspectRatio, layout, photoCount, frameWidth));
      hasInitializedRef.current = true;
    }
  }, [initialSlotsJson]);

  // Handle responsive resize of Stage
  const handleResize = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const availW = container.clientWidth - 32;
    const availH = container.clientHeight - 32;
    
    const factor = Math.min(availW / virtualWidth, availH / virtualHeight);
    setScaleFactor(Math.min(factor, 1));
  }, [virtualWidth, virtualHeight]);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Bind transformer to selected slot
  useEffect(() => {
    if (!selectedSlotId || !transformerRef.current) return;
    const stage = stageRef.current;
    if (!stage) return;
    const selectedNode = stage.findOne(`#${selectedSlotId}`);
    if (selectedNode) {
      transformerRef.current.nodes([selectedNode]);
      transformerRef.current.getLayer().batchDraw();
    } else {
      transformerRef.current.nodes([]);
    }
  }, [selectedSlotId, slots]);

  const addSlot = () => {
    const newId = `slot-${Date.now()}`;
    const newSlot: AdminPhotoSlot = {
      id: newId,
      photoIndex: slots.length % Math.max(1, photoCount),
      x: virtualWidth / 4,
      y: virtualHeight / 4,
      width: virtualWidth / 2,
      height: virtualHeight / 3.5,
      imageScale: 1,
      imageX: 0,
      imageY: 0
    };
    setSlots([...slots, newSlot]);
    setSelectedSlotId(newId);
  };

  const deleteSlot = () => {
    if (!selectedSlotId) return;
    setSlots(slots.filter(s => s.id !== selectedSlotId));
    setSelectedSlotId(null);
  };

  const resetToPreset = () => {
    setSlots(getInitialSlots(aspectRatio, layout, photoCount, frameWidth));
    setSelectedSlotId(null);
  };

  const handleSave = () => {
    onSave(JSON.stringify(slots));
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)' }}>📐 Atur Letak Foto</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Posisikan kotak slot foto agar pas di bawah celah transparan template bingkai.
            </p>
          </div>

          <div className={styles.sidebarContent}>
            {/* Aspect Ratio */}
            <div className={styles.controlGroup}>
              <label className="label">Rasio Aspek Kanvas</label>
              <select
                className="input"
                value={aspectRatio}
                onChange={(e) => {
                  const newRatio = e.target.value;
                  setAspectRatio(newRatio);
                  setSlots(getInitialSlots(newRatio, layout, photoCount, frameWidth));
                }}
                style={{ width: '100%' }}
              >
                <option value="1:3">Strip Vertikal (1:3)</option>
                <option value="2:3">Grid Standar (2:3)</option>
                <option value="1:1">Kotak / Square (1:1)</option>
                <option value="3:4">Portrait Klasik (3:4)</option>
              </select>
            </div>

            {/* Preset Layout */}
            <div className={styles.controlGroup}>
              <label className="label">Preset Susunan Awal</label>
              <select
                className="input"
                value={layout}
                onChange={(e) => {
                  const newLayout = e.target.value as any;
                  setLayout(newLayout);
                  let count = 4;
                  if (newLayout === 'strip3') count = 3;
                  else if (newLayout === 'grid3x2') count = 6;
                  else if (newLayout === 'single') count = 1;
                  setSlots(getInitialSlots(aspectRatio, newLayout, count, frameWidth));
                }}
                style={{ width: '100%' }}
              >
                <option value="strip">Strip 4 Foto (Vertikal)</option>
                <option value="strip3">Strip 3 Foto (Vertikal)</option>
                <option value="grid2x2">Grid 2x2 (4 Foto)</option>
                <option value="grid3x2">Grid 2x3 (6 Foto)</option>
                <option value="single">Satu Foto Penuh (Single)</option>
              </select>
            </div>

            {/* Add / Delete Slot */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <button className="btn btn-secondary btn-sm flex-1" onClick={addSlot} style={{ fontSize: '11px', padding: '10px' }}>
                ➕ Tambah Slot
              </button>
              <button
                className="btn btn-danger btn-sm flex-1"
                onClick={deleteSlot}
                disabled={!selectedSlotId}
                style={{ fontSize: '11px', padding: '10px', opacity: selectedSlotId ? 1 : 0.5 }}
              >
                🗑️ Hapus Slot
              </button>
            </div>

            {/* Selected Slot info */}
            {selectedSlotId && (
              <div className={styles.infoCard}>
                <strong style={{ fontSize: '12px', color: 'var(--pink-light)' }}>🎯 Slot Terpilih</strong>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Gunakan transformer di canvas untuk memindahkan atau meresize slot ini.
                </p>
                
                {/* Photo Index config */}
                <div style={{ marginTop: '8px' }}>
                  <label className="label" style={{ fontSize: '11px' }}>Kaitkan ke Urutan Foto:</label>
                  <select
                    className="input"
                    style={{ width: '100%', padding: '6px', fontSize: '11px' }}
                    value={slots.find(s => s.id === selectedSlotId)?.photoIndex || 0}
                    onChange={(e) => {
                      const idx = parseInt(e.target.value);
                      setSlots(slots.map(s => s.id === selectedSlotId ? { ...s, photoIndex: idx } : s));
                    }}
                  >
                    {Array.from({ length: Math.max(1, photoCount) }).map((_, idx) => (
                      <option key={idx} value={idx}>Foto Ke-{idx + 1}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Reset */}
            <button
              className="btn btn-secondary btn-sm"
              onClick={resetToPreset}
              style={{ width: '100%', marginTop: '12px', fontSize: '11px' }}
            >
              🔄 Reset ke Preset Default
            </button>
          </div>

          <div className={styles.sidebarFooter}>
            <button className="btn btn-primary" onClick={handleSave} style={{ width: '100%', marginBottom: '8px' }}>
              💾 Simpan Tata Letak
            </button>
            <button className="btn btn-secondary" onClick={onClose} style={{ width: '100%' }}>
              Batal
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className={styles.canvasContainer} ref={containerRef}>
          <div
            style={{
              transform: `scale(${scaleFactor})`,
              transformOrigin: 'center center',
              width: virtualWidth,
              height: virtualHeight,
              boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
              background: backgroundColor,
              position: 'relative'
            }}
          >
            <Stage
              ref={stageRef}
              width={virtualWidth}
              height={virtualHeight}
              onClick={(e) => {
                if (e.target === stageRef.current) {
                  setSelectedSlotId(null);
                }
              }}
            >
              <Layer>
                {/* Background color */}
                <Rect
                  x={0}
                  y={0}
                  width={virtualWidth}
                  height={virtualHeight}
                  fill={backgroundColor}
                />

                {/* Photo Slots */}
                {slots.map((slot, index) => {
                  const isSelected = selectedSlotId === slot.id;
                  return (
                    <Group
                      key={slot.id}
                      id={slot.id}
                      x={slot.x}
                      y={slot.y}
                      width={slot.width}
                      height={slot.height}
                      onClick={() => setSelectedSlotId(slot.id)}
                      onTap={() => setSelectedSlotId(slot.id)}
                      draggable={true}
                      onDragEnd={(e) => {
                        const node = e.target;
                        setSlots(slots.map(s => s.id === slot.id ? { ...s, x: node.x(), y: node.y() } : s));
                      }}
                      onTransformEnd={(e) => {
                        const node = e.target;
                        const scaleX = node.scaleX();
                        const scaleY = node.scaleY();
                        node.scaleX(1);
                        node.scaleY(1);
                        setSlots(slots.map(s => s.id === slot.id ? {
                          ...s,
                          x: node.x(),
                          y: node.y(),
                          width: Math.max(50, node.width() * scaleX),
                          height: Math.max(50, node.height() * scaleY)
                        } : s));
                      }}
                    >
                      <Rect
                        x={0}
                        y={0}
                        width={slot.width}
                        height={slot.height}
                        fill="rgba(233, 30, 140, 0.15)"
                        stroke={isSelected ? "var(--pink-hot)" : frameColor}
                        strokeWidth={isSelected ? 4 : 2}
                        dash={isSelected ? undefined : [8, 4]}
                      />
                      <Text
                        x={0}
                        y={slot.height / 2 - 14}
                        width={slot.width}
                        text={`SLOT FOTO ${index + 1}\n(Foto ke-${slot.photoIndex + 1})`}
                        align="center"
                        fill="white"
                        fontStyle="bold"
                        fontSize={14}
                      />
                    </Group>
                  );
                })}

                {/* Border frames */}
                {frameWidth > 0 && (
                  <Rect
                    x={frameWidth / 6}
                    y={frameWidth / 6}
                    width={virtualWidth - (frameWidth / 3)}
                    height={virtualHeight - (frameWidth / 3)}
                    stroke={frameColor}
                    strokeWidth={frameWidth / 3}
                    listening={false}
                  />
                )}

                {/* Footer zone */}
                <Group x={0} y={virtualHeight - 150} width={virtualWidth} height={150}>
                  <Rect
                    x={0}
                    y={0}
                    width={virtualWidth}
                    height={150}
                    fill={frameColor + '11'}
                    listening={false}
                  />
                  <Text
                    x={0}
                    y={65}
                    width={virtualWidth}
                    text="📐 AREA FOOTER TEMPLATE"
                    align="center"
                    fill="rgba(255,255,255,0.3)"
                    fontSize={16}
                    fontStyle="bold"
                    listening={false}
                  />
                </Group>

                {/* Overlay transparan */}
                {overlayImg && (
                  <KonvaImage
                    image={overlayImg}
                    x={0}
                    y={0}
                    width={virtualWidth}
                    height={virtualHeight}
                    listening={false} // Click through!
                  />
                )}

                {/* Transformer */}
                {selectedSlotId && (
                  <Transformer
                    ref={transformerRef}
                    keepRatio={false}
                    boundBoxFunc={(oldBox, newBox) => {
                      if (newBox.width < 50 || newBox.height < 50) return oldBox;
                      return newBox;
                    }}
                  />
                )}
              </Layer>
            </Stage>
          </div>
        </div>
      </div>
    </div>
  );
}
