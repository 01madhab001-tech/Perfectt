"use client"

import { motion } from "framer-motion"
import { MoveRight } from "lucide-react"

export default function FirstScreen({ onNext }) {
    return (
        <div className="flex flex-col items-center justify-center relative">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 flex flex-col items-center"
            >
                <motion.div
                    className="mb-10 w-32 h-32 relative flex items-center justify-center"
                >
                    <motion.img animate={{ scale: [1, 1.03, 1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", }}
                        src="/gifs/holding-heart.gif" alt="holding-heart" className="opacity-95" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-4xl md:text-6xl text-center mb-5 max-w-3xl text-balance leading-tight text-foreground font-medium"
                >
                    There is something
                    I want to tell you
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-lg text-foreground/90 text-center max-w-md mb-10 font-light"
                >
                    I hope you feel this
                </motion.p>

                {/* button */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1 }}
                >
                    <button
                        onClick={onNext}
                        className="px-10 py-4 bg-linear-to-r from-primary to-secondary text-primary-foreground rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:from-primary/90 hover:to-secondary/90 hover:shadow-primary/20 flex items-center gap-2 font-medium"
                    >
                        Continue <MoveRight size={18} className="mb-0.5" />
                    </button>
                </motion.div>
            </motion.div>
        </div>
    )
}
