"use client"

import { memo, useEffect, useState } from "react"
import { motion } from "framer-motion"

function Background() {
    const [stars, setStars] = useState([])
    const [shootingStars, setShootingStars] = useState([])
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)

        // Static twinkling stars
        const staticStars = Array.from({ length: 80 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            top: Math.random() * 100,
            size: Math.random() * 2 + 1,
            duration: Math.random() * 4 + 2,
            delay: Math.random() * 4,
        }))
        setStars(staticStars)

        // Shooting stars — spawn one every 1.8s
        let id = 0
        const spawn = () => {
            const star = {
                id: id++,
                // start from random point across top half
                startX: Math.random() * 120 - 10,  // vw
                startY: Math.random() * 40,          // vh
                // travel diagonally down-right
                angle: Math.random() * 20 + 25,      // degrees
                length: Math.random() * 120 + 80,    // px
                duration: Math.random() * 0.6 + 0.5, // seconds
                delay: 0,
            }
            setShootingStars(prev => [...prev.slice(-6), star]) // keep max 6
        }

        spawn() // fire one immediately
        const interval = setInterval(spawn, 1800)
        return () => clearInterval(interval)
    }, [])

    if (!mounted) return null

    return (
        <>
            {/* Deep space background */}
            <div
                className="fixed inset-0 -z-10"
                style={{
                    background: "radial-gradient(125% 125% at 50% 90%, #000000 40%, #0a0d1f 70%, #0d1a36 100%)",
                }}
            />

            {/* Static twinkling stars */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                {stars.map((star) => (
                    <motion.div
                        key={star.id}
                        className="absolute rounded-full bg-white"
                        style={{
                            left: `${star.left}%`,
                            top: `${star.top}%`,
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                        }}
                        animate={{ opacity: [0.1, 0.7, 0.1] }}
                        transition={{
                            duration: star.duration,
                            repeat: Infinity,
                            delay: star.delay,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            {/* Shooting stars */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                {shootingStars.map((s) => {
                    const rad = (s.angle * Math.PI) / 180
                    const dx = Math.cos(rad) * s.length
                    const dy = Math.sin(rad) * s.length

                    return (
                        <motion.div
                            key={s.id}
                            style={{
                                position: "absolute",
                                left: `${s.startX}vw`,
                                top: `${s.startY}vh`,
                                width: `${s.length}px`,
                                height: "1.5px",
                                borderRadius: "9999px",
                                background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 60%, white 100%)",
                                transformOrigin: "left center",
                                rotate: `${s.angle}deg`,
                            }}
                            initial={{ opacity: 0, scaleX: 0, x: 0, y: 0 }}
                            animate={{
                                opacity: [0, 1, 1, 0],
                                scaleX: [0, 1, 1, 1],
                                x: [0, dx * 0.3, dx],
                                y: [0, dy * 0.3, dy],
                            }}
                            transition={{
                                duration: s.duration,
                                ease: "easeIn",
                                times: [0, 0.2, 0.7, 1],
                            }}
                        />
                    )
                })}
            </div>
        </>
    )
}

export default memo(Background)
