"use client"

export const dynamic = "force-static"

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Background from "@/components/Background";
import LyricsScreen from "@/components/LyricsScreen";

export default function Home() {
  const [started, setStarted] = useState(false);
  const audioRef = useRef(null);

  const handleStart = () => {
    setStarted(true);
    if (audioRef.current) {
      audioRef.current.volume = 0.8;
      audioRef.current.play().catch(console.log);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center relative px-4 py-8 overflow-hidden">
      <Background />

      <audio ref={audioRef} preload="auto">
        <source src="/audio/bg.mp3" type="audio/mpeg" />
      </audio>

      <AnimatePresence mode="wait">
        {!started ? (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center justify-center text-center px-6"
          >
            {/* Top line — small cinematic label */}
            <motion.p
              initial={{ opacity: 0, letterSpacing: "0.3em" }}
              animate={{ opacity: 0.4, letterSpacing: "0.5em" }}
              transition={{ delay: 0.4, duration: 1.5 }}
              className="text-xs text-white uppercase tracking-widest mb-10"
            >
              A message
            </motion.p>

            {/* Main title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
              className="text-5xl md:text-7xl font-bold text-white leading-tight mb-4"
              style={{ fontFamily: "serif", letterSpacing: "-0.02em" }}
            >
              Let me show you
              <br />
              <span style={{ fontStyle: "italic", opacity: 0.85 }}>something.</span>
            </motion.h1>

            {/* Thin divider line */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "60px" }}
              transition={{ delay: 1.6, duration: 1, ease: "easeOut" }}
              className="h-px bg-white opacity-30 mb-10"
            />

            {/* Tap button — minimal, cinematic */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 1 }}
              onClick={handleStart}
              className="relative text-white text-sm uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity duration-500"
            >
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                — Tap to begin —
              </motion.span>
            </motion.button>

          </motion.div>
        ) : (
          <motion.div
            key="lyrics"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <LyricsScreen />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Watermark */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="fixed bottom-4 right-4 text-xs text-white/20 pointer-events-none z-50 tracking-widest uppercase"
      >
        axee builds
      </motion.div>
    </div>
  );
}
