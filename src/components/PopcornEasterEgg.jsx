import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Підхоплюємо виключно kernel.png та popcorn.png з src/assets/ (або src/assets/popcorn/)
const matchedModules = import.meta.glob(
  [
    '../assets/kernel.png',
    '../assets/popcorn.png',
    '../assets/popcorn/kernel.png',
    '../assets/popcorn/popcorn.png',
  ],
  { eager: true }
);

const loadedSprites = Object.entries(matchedModules).map(([path, mod]) => ({
  name: path.split('/').pop().toLowerCase(),
  url: mod.default,
}));

const kernelSprite = loadedSprites.find((item) => item.name === 'kernel.png')?.url;
const popcornSprite = loadedSprites.find((item) => item.name === 'popcorn.png')?.url;

// Збільшені розміри та розкид по бокових полях
const SPATTERED_KERNELS = [
  // Лівий бік
  { id: 'l1', side: 'left', top: '140px', offset: '22px', size: 44, triggerScroll: 0 },
  { id: 'l2', side: 'left', top: '390px', offset: '52px', size: 56, triggerScroll: 80 },
  { id: 'l3', side: 'left', top: '650px', offset: '16px', size: 40, triggerScroll: 220 },
  { id: 'l4', side: 'left', top: '920px', offset: '58px', size: 64, triggerScroll: 420 },
  { id: 'l5', side: 'left', top: '1240px', offset: '24px', size: 46, triggerScroll: 620 },
  { id: 'l6', side: 'left', top: '1580px', offset: '42px', size: 52, triggerScroll: 850 },

  // Правий бік
  { id: 'r1', side: 'right', top: '210px', offset: '46px', size: 54, triggerScroll: 30 },
  { id: 'r2', side: 'right', top: '470px', offset: '18px', size: 42, triggerScroll: 160 },
  { id: 'r3', side: 'right', top: '780px', offset: '56px', size: 62, triggerScroll: 340 },
  { id: 'r4', side: 'right', top: '1080px', offset: '26px', size: 46, triggerScroll: 540 },
  { id: 'r5', side: 'right', top: '1400px', offset: '50px', size: 58, triggerScroll: 780 },
  { id: 'r6', side: 'right', top: '1720px', offset: '20px', size: 44, triggerScroll: 980 },
];

export const PopcornEasterEgg = () => {
  const [poppedState, setPoppedState] = useState({});
  const [scrollY, setScrollY] = useState(0);

  // Випадковий початковий кут повороту для кожного зернятка
  const [initialRotations] = useState(() =>
    SPATTERED_KERNELS.reduce((acc, k) => {
      acc[k.id] = Math.floor(Math.random() * 360);
      return acc;
    }, {})
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePop = (id) => {
    if (poppedState[id] || !popcornSprite) return;

    const randomRotate = Math.floor(Math.random() * 360);

    setPoppedState((prev) => ({
      ...prev,
      [id]: {
        sprite: popcornSprite,
        rotate: randomRotate,
      },
    }));
  };

  if (!kernelSprite && !popcornSprite) return null;

  return (
    <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none select-none z-0 overflow-hidden hidden xl:block">
      {SPATTERED_KERNELS.map((k) => {
        const poppedData = poppedState[k.id];
        const isPopped = Boolean(poppedData);
        const isLeft = k.side === 'left';
        const isVisible = scrollY >= k.triggerScroll - 280;
        const baseRotate = initialRotations[k.id] ?? 0;

        return (
          <div
            key={k.id}
            style={{
              position: 'absolute',
              top: k.top,
              [isLeft ? 'left' : 'right']: k.offset,
              WebkitTapHighlightColor: 'transparent',
            }}
            className="pointer-events-auto cursor-pointer outline-none select-none"
            onClick={() => handlePop(k.id)}
            title={isPopped ? 'Попкорн готовий!' : 'Клацни, щоб лопнути зернятко!'}
          >
            <AnimatePresence mode="wait">
              {isVisible && !isPopped && (
                <motion.div
                  key="kernel"
                  initial={{ opacity: 0, scale: 0.3, rotate: baseRotate }}
                  animate={{
                    opacity: 0.95,
                    scale: 1,
                    rotate: [baseRotate, baseRotate - 4, baseRotate + 4, baseRotate],
                  }}
                  transition={{
                    opacity: { duration: 0.3 },
                    rotate: { repeat: Infinity, duration: 4.5, ease: 'easeInOut' },
                  }}
                  whileHover={{ scale: 1.25, opacity: 1, rotate: baseRotate + 12 }}
                  whileTap={{ scale: 0.85 }}
                >
                  <img
                    src={kernelSprite || popcornSprite}
                    alt=""
                    draggable={false}
                    style={{ width: k.size, height: k.size }}
                    className="object-contain drop-shadow-[2px_4px_3px_rgba(0,0,0,0.35)]"
                  />
                </motion.div>
              )}

              {isVisible && isPopped && (
                <motion.div
                  key="popcorn"
                  initial={{ scale: 0, rotate: poppedData.rotate - 30 }}
                  animate={{ scale: [0, 1.4, 1.1], rotate: poppedData.rotate }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <img
                    src={poppedData.sprite}
                    alt=""
                    draggable={false}
                    style={{ width: k.size + 18, height: k.size + 18 }}
                    className="object-contain drop-shadow-[2px_5px_4px_rgba(0,0,0,0.4)]"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
