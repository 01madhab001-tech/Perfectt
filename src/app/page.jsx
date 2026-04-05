"use client"

export const dynamic = "force-static"

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Background from "@/components/Background";
import LyricsScreen from "@/components/LyricsScreen";
import Music from "@/components/Music";

export default function Home() {
  const [started, setStarted] = useState(false);

  return (
    <div
      className="flex min-h-screen items-center justify-center relative px-4 py-8 overflow-hidden"
      onClick={() => setStarted(true)}
    >
      <Background />
      {started && <Music shouldPlay={true} />}

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
        className="fixed bottom-4 right-4 text-sm text-white/30 pointer-events-none z-50 font-light"
      >
        @axee builds
      </motion.div>
    </div>
  );
}
