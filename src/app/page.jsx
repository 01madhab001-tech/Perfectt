"use client"

export const dynamic = "force-static"

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Background from "@/components/Background";
import LyricsScreen from "@/components/LyricsScreen";

export default function Home() {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.8;
      audioRef.current.play().catch(console.log);
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center relative px-4 py-8 overflow-hidden">
      <Background />

      {/* Pre-load audio */}
      <audio ref={audioRef} preload="auto">
        <source src="/audio/bg.mp3" type="audio/mpeg" />
      </audio>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <LyricsScreen />
      </motion.div>

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
