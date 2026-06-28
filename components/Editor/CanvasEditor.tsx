"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Stage,
  Layer,
  Rect,
  Image as KonvaImage,
  Group,
  Text,
  Transformer,
} from "react-konva";
import styles from "./CanvasEditor.module.css";
import { Template } from "@/lib/templates";

export interface PhotoSlot {
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
  photos: string[];
  layout:
    | "strip"
    | "grid2x2"
    | "grid3x2"
    | "single"
    | "strip3"
    | "grid"
    | "grid2x3"
    | "grid2x4";
  template: Template;
  customText: string;
  showDate: boolean;
  onExport: (dataUrl: string) => void;

  // New layout adjustment props
  slots: PhotoSlot[];
  setSlots: (slots: PhotoSlot[]) => void;
  selectedSlotId: string | null;
  setSelectedSlotId: (id: string | null) => void;
  isLayoutLocked: boolean;
  aspectRatio: string;
  autoFill: boolean;
  enablePhotoDrag?: boolean;
}

function useCanvasImage(src?: string) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
    if (!src) {
      setImg(null);
      return;
    }
    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.src = src;
    image.onload = () => setImg(image);
    image.onerror = () => setImg(null);
  }, [src]);
  return img;
}

export default function CanvasEditor({
  photos,
  layout,
  template,
  customText,
  showDate,
  onExport,
  slots,
  setSlots,
  selectedSlotId,
  setSelectedSlotId,
  isLayoutLocked,
  aspectRatio,
  autoFill,
  enablePhotoDrag = false,
}: Props) {
  const [loadedPhotos, setLoadedPhotos] = useState<HTMLImageElement[]>([]);
  const stageRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // For responsive scaling of the editor stage
  const [scaleFactor, setScaleFactor] = useState(1);

  // Set native/virtual dimensions based on aspect ratio
  let virtualWidth = 1200;
  let virtualHeight = 1800; // default 2:3

  if (aspectRatio === "1:3") {
    virtualWidth = 600;
    virtualHeight = 1800;
  } else if (aspectRatio === "1:1") {
    virtualWidth = 1200;
    virtualHeight = 1200;
  } else if (aspectRatio === "3:4") {
    virtualWidth = 1200;
    virtualHeight = 1600;
  }

  // Load photos
  useEffect(() => {
    const promises = photos.map((src) => {
      return new Promise<HTMLImageElement>((resolve) => {
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = () => resolve(img); // resolve even if error to keep index mapping
      });
    });
    Promise.all(promises).then((imgs) => setLoadedPhotos(imgs));
  }, [photos]);

  // Load overlay
  const overlayImg = useCanvasImage(
    template.overlayImage
      ? `${process.env.NEXT_PUBLIC_API_URL}${template.overlayImage}`
      : undefined,
  );

  // Compute scale factor to fit the container visually
  const handleResize = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const pad = 32;
    const availW = container.clientWidth - pad;
    const availH = container.clientHeight - pad;

    const factor = Math.min(availW / virtualWidth, availH / virtualHeight);
    setScaleFactor(Math.min(factor, 1));
  }, [virtualWidth, virtualHeight]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  // High quality stage image export
  const triggerExport = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;

    // Hide transformer and selection boxes before export
    const transformer = transformerRef.current;
    if (transformer) transformer.nodes([]);

    const dataUrl = stage.toDataURL({
      mimeType: "image/jpeg",
      quality: 0.92,
      pixelRatio: 1,
    });

    // Restore transformer if not locked
    if (transformer && selectedSlotId && !isLayoutLocked) {
      const selectedNode = stage.findOne(`#${selectedSlotId}`);
      if (selectedNode) transformer.nodes([selectedNode]);
    }

    onExport(dataUrl);
  }, [onExport, selectedSlotId, isLayoutLocked]);

  // Debounced export to maintain perfect UI performance
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerExport();
    }, 400);
    return () => clearTimeout(timer);
  }, [
    triggerExport,
    slots,
    customText,
    showDate,
    template,
    loadedPhotos,
    overlayImg,
    aspectRatio,
    autoFill,
  ]);

  // Bind transformer to the selected slot node
  useEffect(() => {
    if (isLayoutLocked || !selectedSlotId || !transformerRef.current) return;
    const stage = stageRef.current;
    if (!stage) return;
    const selectedNode = stage.findOne(`#${selectedSlotId}`);
    if (selectedNode) {
      transformerRef.current.nodes([selectedNode]);
      transformerRef.current.getLayer().batchDraw();
    } else {
      transformerRef.current.nodes([]);
    }
  }, [selectedSlotId, isLayoutLocked, slots]);

  const getPhotoPlacement = (img: HTMLImageElement, slot: PhotoSlot) => {
    const photoW = img.width || 640;
    const photoH = img.height || 480;

    // Calculate scale to cover the slot
    const scale = Math.max(slot.width / photoW, slot.height / photoH);
    return {
      width: photoW * scale * slot.imageScale,
      height: photoH * scale * slot.imageScale,
    };
  };

  return (
    <div className={styles.wrapper} ref={containerRef}>
      <div
        style={{
          transform: `scale(${scaleFactor})`,
          transformOrigin: "center center",
          width: virtualWidth,
          height: virtualHeight,
          boxShadow: "0 12px 36px rgba(0,0,0,0.5)",
          background: template.backgroundColor,
          position: "relative",
        }}
      >
        <Stage
          ref={stageRef}
          width={virtualWidth}
          height={virtualHeight}
          onClick={(e) => {
            // Deselect when clicking on empty stage
            if (e.target === stageRef.current) {
              setSelectedSlotId(null);
            }
          }}
        >
          <Layer>
            {/* Background Color */}
            <Rect
              x={0}
              y={0}
              width={virtualWidth}
              height={virtualHeight}
              fill={template.backgroundColor}
            />

            {/* Photo Slots */}
            {slots.map((slot, slotIdx) => {
              // Determine if we should auto-fill or if there's a specific photo index
              let finalPhotoIndex = slot.photoIndex;
              if (
                finalPhotoIndex === -1 &&
                autoFill &&
                loadedPhotos.length > 0
              ) {
                finalPhotoIndex = slotIdx % loadedPhotos.length;
              }

              const photoImg =
                finalPhotoIndex !== -1 && loadedPhotos[finalPhotoIndex]
                  ? loadedPhotos[finalPhotoIndex]
                  : undefined;
              const isSelected = selectedSlotId === slot.id;

              return (
                <Group
                  key={slot.id}
                  id={slot.id}
                  x={slot.x}
                  y={slot.y}
                  width={slot.width}
                  height={slot.height}
                  clipX={0}
                  clipY={0}
                  clipWidth={slot.width}
                  clipHeight={slot.height}
                  onClick={() => setSelectedSlotId(slot.id)}
                  onTap={() => setSelectedSlotId(slot.id)}
                  draggable={!isLayoutLocked}
                  onDragEnd={(e) => {
                    if (e.target !== e.currentTarget) return;
                    const node = e.target;
                    const updatedSlots = slots.map((s) => {
                      if (s.id === slot.id) {
                        return { ...s, x: node.x(), y: node.y() };
                      }
                      return s;
                    });
                    setSlots(updatedSlots);
                  }}
                  onTransformEnd={(e) => {
                    if (e.target !== e.currentTarget) return;
                    const node = e.target;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    // Reset scaling on the node itself to prevent coordinate issues
                    node.scaleX(1);
                    node.scaleY(1);

                    const updatedSlots = slots.map((s) => {
                      if (s.id === slot.id) {
                        return {
                          ...s,
                          x: node.x(),
                          y: node.y(),
                          width: Math.max(50, node.width() * scaleX),
                          height: Math.max(50, node.height() * scaleY),
                        };
                      }
                      return s;
                    });
                    setSlots(updatedSlots);
                  }}
                >
                  {/* Base slot background */}
                  <Rect
                    x={0}
                    y={0}
                    width={slot.width}
                    height={slot.height}
                    fill="#1a1a24"
                    stroke={template.hasFrame ? template.frameColor : undefined}
                    strokeWidth={template.hasFrame ? 2 : 0}
                  />

                  {photoImg ? (
                    (() => {
                      const placement = getPhotoPlacement(photoImg, slot);
                      const isUnadjusted =
                        slot.imageX === 0 && slot.imageY === 0;
                      const defaultX = isUnadjusted
                        ? (slot.width - placement.width) / 2
                        : slot.imageX;
                      const defaultY = isUnadjusted
                        ? (slot.height - placement.height) / 2
                        : slot.imageY;

                      return (
                        <KonvaImage
                          image={photoImg}
                          x={defaultX}
                          y={defaultY}
                          width={placement.width}
                          height={placement.height}
                          draggable={enablePhotoDrag}
                          onMouseEnter={(e) => {
                            if (enablePhotoDrag) {
                              const stage = e.target.getStage();
                              if (stage)
                                stage.container().style.cursor = "grab";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (enablePhotoDrag) {
                              const stage = e.target.getStage();
                              if (stage)
                                stage.container().style.cursor = "default";
                            }
                          }}
                          onDragStart={(e) => {
                            if (enablePhotoDrag) {
                              const stage = e.target.getStage();
                              if (stage)
                                stage.container().style.cursor = "grabbing";
                            }
                          }}
                          onDragEnd={(e) => {
                            e.cancelBubble = true; // Prevent event from bubbling up to Group
                            const stage = e.target.getStage();
                            if (stage && enablePhotoDrag) {
                              stage.container().style.cursor = "grab";
                            }
                            const node = e.target;
                            const updatedSlots = slots.map((s) => {
                              if (s.id === slot.id) {
                                return {
                                  ...s,
                                  imageX: node.x(),
                                  imageY: node.y(),
                                };
                              }
                              return s;
                            });
                            setSlots(updatedSlots);
                          }}
                        />
                      );
                    })()
                  ) : (
                    <Text
                      x={0}
                      y={slot.height / 2 - 10}
                      width={slot.width}
                      text={`Slot Foto ${slotIdx + 1}`}
                      align="center"
                      fill="#666"
                      fontSize={14}
                    />
                  )}

                  {/* Active selection outline when layout is unlocked */}
                  {isSelected && !isLayoutLocked && (
                    <Rect
                      x={0}
                      y={0}
                      width={slot.width}
                      height={slot.height}
                      stroke="rgba(233, 30, 140, 0.8)"
                      strokeWidth={4}
                      listening={false}
                    />
                  )}
                </Group>
              );
            })}

            {/* Canvas Decorative Border */}
            {template.hasFrame && (
              <Rect
                x={template.frameWidth / 6}
                y={template.frameWidth / 6}
                width={virtualWidth - template.frameWidth / 3}
                height={virtualHeight - template.frameWidth / 3}
                stroke={template.frameColor}
                strokeWidth={template.frameWidth / 3}
                listening={false}
              />
            )}

            {/* Footer Area (Text/Logo/Date) */}
            <Group
              x={0}
              y={virtualHeight - 150}
              width={virtualWidth}
              height={150}
            >
              <Rect
                x={0}
                y={0}
                width={virtualWidth}
                height={150}
                fill={template.frameColor + "11"}
                listening={false}
              />

              {customText && (
                <Text
                  x={0}
                  y={30}
                  width={virtualWidth}
                  text={customText}
                  fontSize={aspectRatio === "1:3" ? 24 : 28}
                  fontFamily={template.fonts || "sans-serif"}
                  fontStyle="bold"
                  fill={template.textColor}
                  align="center"
                  listening={false}
                />
              )}

              {template.hasLogo && (
                <Text
                  x={0}
                  y={customText ? 75 : 55}
                  width={virtualWidth}
                  text="📸 PhotoBooth"
                  fontSize={18}
                  fontFamily={template.fonts || "sans-serif"}
                  fontStyle="bold"
                  fill={template.accentColor}
                  align="center"
                  listening={false}
                />
              )}

              {showDate && template.hasDate && (
                <Text
                  x={0}
                  y={customText ? 110 : 90}
                  width={virtualWidth}
                  text={new Date().toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  fontSize={14}
                  fontFamily={template.fonts || "sans-serif"}
                  fill={template.textColor + "aa"}
                  align="center"
                  listening={false}
                />
              )}
            </Group>

            {/* Overlay PNG (Frames with transparent windows) */}
            {overlayImg && (
              <KonvaImage
                image={overlayImg}
                x={0}
                y={0}
                width={virtualWidth}
                height={virtualHeight}
                listening={false} // Click through overlay to select photos underneath!
              />
            )}

            {/* Bounding Box Transformer when Unlocked */}
            {!isLayoutLocked && selectedSlotId && (
              <Transformer
                ref={transformerRef}
                keepRatio={false}
                boundBoxFunc={(oldBox, newBox) => {
                  if (newBox.width < 50 || newBox.height < 50) {
                    return oldBox;
                  }
                  return newBox;
                }}
              />
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
