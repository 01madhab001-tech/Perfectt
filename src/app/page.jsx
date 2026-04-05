"use client"

export const dynamic = "force-static"

import { useState, useEffect, useRef } from "react";
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

      {/* Pre-load audio */}
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
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center"
          >
            <motion.img
              src="/gifs/holding-heart.gif"
              alt="holding-heart"
              className="w-32 h-32 mb-10 opacity-95"
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl md:text-6xl text-center mb-5 max-w-3xl text-balance leading-tight text-foreground font-medium"
            >
              There is something I want to tell you
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-lg text-foreground/90 text-center max-w-md mb-10 font-light"
            >
              Tap to feel it
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              onClick={handleStart}
              className="px-10 py-4 bg-linear-to-r from-primary to-secondary text-primary-foreground rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:from-primary/90 hover:to-secondary/90 hover:shadow-primary/20 font-medium"
            >
              ♥ Open
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="lyrics"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <LyricsScreen />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Watermark */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed bottom-4 right-4 text-sm text-white/30 pointer-events-none z-50 font-light">
        @axee builds
      </motion.div>
    </div>
  );
}
