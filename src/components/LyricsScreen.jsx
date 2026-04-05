"use client"

export const dynamic = "force-static"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TextAnimate } from "./ui/text-animate"

// Lyrics from 0:40 — Night Changes chorus + second verse
// Timings carefully matched to the song
const lyrics = [
    { text: "We're only getting older, baby",              duration: 3800, anim: 2.2 },
    { text: "And I've been thinking about it lately",      duration: 3800, anim: 2.5 },
    { text: "Does it ever drive you crazy",                duration: 3200, anim: 2.0 },
    { text: "Just how fast the night changes?",            duration: 4200, anim: 2.5 },
    { text: "Everything that you've ever dreamed of",      duration: 3800, anim: 2.5 },
    { text: "Disappearing when you wake up",               duration: 3500, anim: 2.2 },
    { text: "But there's nothing to be afraid of",         duration: 3800, anim: 2.5 },
    { text: "Even when the night changes",                 duration: 3500, anim: 2.2 },
    { text: "It will never change me and you",             duration: 6000, anim: 3.0 },
]

export default function LyricsScreen() {
    const [currentLyricIndex, setCurrentLyricIndex] = useState(0)
    const [isAnimating, setIsAnimating]             = useState(true)
    const [fadeOut, setFadeOut]                     = useState(false)

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
