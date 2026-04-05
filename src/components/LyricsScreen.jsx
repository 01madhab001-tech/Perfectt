"use client"

export const dynamic = "force-static"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TextAnimate } from "./ui/text-animate"

// Timings matched to "Perfect" by Ed Sheeran
// Each lyric: how long it stays on screen before switching (ms)
const lyrics = [
    { text: "We are still kids, but we're so in love",  duration: 4200, anim: 2.5 },
    { text: "Fightin' against all odds",                duration: 3600, anim: 2.2 },
    { text: "I know we'll be alright this time",        duration: 5800, anim: 3.0 },
    { text: "Darlin', just hold my hand",               duration: 3800, anim: 2.2 },
    { text: "Be my girl, I'll be your man",             duration: 4000, anim: 2.2 },
    { text: "I see my future in your eyes",             duration: 6000, anim: 3.0 },
]

export default function LyricsScreen({ canStart }) {
    const [currentLyricIndex, setCurrentLyricIndex] = useState(0)
    const [isAnimating, setIsAnimating]             = useState(false)
    const [fadeOut, setFadeOut]                     = useState(false)

    // Start only when audio is confirmed playing
    useEffect(() => {
        if (canStart) setIsAnimating(true)
    }, [canStart])

    useEffect(() => {
        if (!isAnimating) return

        const duration = lyrics[currentLyricIndex].duration

        const timer = setTimeout(() => {
            if (currentLyricIndex < lyrics.length - 1) {
                setCurrentLyricIndex(prev => prev + 1)
            } else {
                setFadeOut(true)
                setTimeout(() => setIsAnimating(false), 2500)
            }
        }, duration)

        return () => clearTimeout(timer)
    }, [isAnimating, currentLyricIndex])

    return (
        <div className="w-full max-w-2xl lg:max-w-3xl flex flex-col items-center justify-center relative">
            <AnimatePresence mode="wait">
                {isAnimating && currentLyricIndex < lyrics.length && (
                    <motion.div
                        key={currentLyricIndex}
                        initial={{ opacity: 0, y: 10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.97 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="text-center"
                    >
                        <TextAnimate
                            by="word"
                            duration={lyrics[currentLyricIndex].anim}
                            animation="blurInUp"
                            className="text-4xl md:text-5xl lg:text-6xl text-foreground drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] text-balance leading-normal"
                        >
                            {lyrics[currentLyricIndex].text}
                        </TextAnimate>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                className="fixed inset-0 bg-black pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: fadeOut ? 1 : 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
            />
        </div>
    )
}
