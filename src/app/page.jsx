"use client"

export const dynamic = "force-static"

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Background from "@/components/Background";
import LyricsScreen from "@/components/LyricsScreen";

export default function Home() {
  const audioRef = useRef(null);
  const [lyricsReady, setLyricsReady] = useState(false);

  const handleTap = () => {
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => {
          // Audio actually started — now begin lyrics in sync
          setLyricsReady(true);
        })
        .catch(() => {
          // fallback: start lyrics anyway after small delay
          setTimeout(() => setLyricsReady(true), 500);
        });
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center relative px-4 py-8 overflow-hidden"
      onClick={handleTap}
    >
      <Background />

      <audio ref={audioRef} preload="auto">
        <source src="/audio/bg.mp3" type="audio/mpeg" />
      </audio>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <LyricsScreen canStart={lyricsReady} />
      </motion.div>

      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed bottom-4 right-4 text-sm text-white/30 pointer-events-none z-50 font-light"
      >
        @axee builds
      </motion.div>
    </div>
  );
}
