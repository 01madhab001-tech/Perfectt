"use client"

import { memo, useEffect, useRef } from "react"

function Background() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")

        let W = window.innerWidth
        let H = window.innerHeight
        let animId

        const resize = () => {
            W = window.innerWidth
            H = window.innerHeight
            canvas.width = W
            canvas.height = H
        }
        canvas.width = W
        canvas.height = H
        window.addEventListener("resize", resize)

        // ── Twinkling stars ───────────────────────────────────────
        const stars = Array.from({ length: 200 }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            r: Math.random() * 1.2 + 0.2,
            alpha: Math.random() * 0.6 + 0.1,
            twinkleSpeed: Math.random() * 0.008 + 0.002,
            twinkleDir: Math.random() > 0.5 ? 1 : -1,
        }))

        // ── Comet / light streak (Your Name style) ────────────────
        class Comet {
            constructor(delay = 0) {
                this.delay = delay
                this.active = false
                this.timer = 0
                this.reset()
            }
            reset() {
                // start from upper-left region, travel diagonally
                this.x = Math.random() * W * 0.6
                this.y = Math.random() * H * 0.3 - 50
                this.angle = Math.random() * 15 + 25   // degrees
                this.speed = Math.random() * 6 + 5
                this.len = Math.random() * 220 + 120
                this.width = Math.random() * 1.5 + 0.8
                this.alpha = 0
                this.life = 0
                this.maxLife = Math.random() * 40 + 50
                this.trail = []
                this.vx = Math.cos((this.angle * Math.PI) / 180) * this.speed
                this.vy = Math.sin((this.angle * Math.PI) / 180) * this.speed
                this.glow = Math.random() * 6 + 4
                // random soft color: white, pale blue, pale gold
                const colors = [
                    "255,255,255",
                    "200,220,255",
                    "255,240,200",
                    "180,200,255",
                ]
                this.color = colors[Math.floor(Math.random() * colors.length)]
                this.nextSpawn = Math.random() * 180 + 80
                this.spawnTimer = this.delay
                this.waiting = true
            }
            update() {
                if (this.waiting) {
                    this.spawnTimer--
                    if (this.spawnTimer <= 0) this.waiting = false
                    return
                }

                this.trail.push({ x: this.x, y: this.y, alpha: this.alpha })
                if (this.trail.length > 28) this.trail.shift()

                this.x += this.vx
                this.y += this.vy
                this.life++

                // fade in then out
                if (this.life < 12) this.alpha = this.life / 12
                else if (this.life > this.maxLife - 15) this.alpha = Math.max(0, (this.maxLife - this.life) / 15)
                else this.alpha = 1

                if (this.life >= this.maxLife) {
                    this.delay = 0
                    this.reset()
                    this.waiting = true
                    this.spawnTimer = this.nextSpawn
                }
            }
            draw(ctx) {
                if (this.waiting || this.alpha <= 0) return

                // Draw trail
                for (let i = 0; i < this.trail.length; i++) {
                    const t = this.trail[i]
                    const prog = i / this.trail.length
                    const a = t.alpha * prog * 0.4
                    ctx.beginPath()
                    ctx.arc(t.x, t.y, this.width * 0.5 * prog, 0, Math.PI * 2)
                    ctx.fillStyle = `rgba(${this.color},${a})`
                    ctx.fill()
                }

                // Draw head glow
                const grad = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.glow * 2
                )
                grad.addColorStop(0, `rgba(${this.color},${this.alpha})`)
                grad.addColorStop(0.4, `rgba(${this.color},${this.alpha * 0.4})`)
                grad.addColorStop(1, `rgba(${this.color},0)`)
                ctx.beginPath()
                ctx.arc(this.x, this.y, this.glow * 2, 0, Math.PI * 2)
                ctx.fillStyle = grad
                ctx.fill()

                // Draw streak line
                const tailX = this.x - this.vx * (this.len / this.speed)
                const tailY = this.y - this.vy * (this.len / this.speed)
                const lineGrad = ctx.createLinearGradient(tailX, tailY, this.x, this.y)
                lineGrad.addColorStop(0, `rgba(${this.color},0)`)
                lineGrad.addColorStop(0.6, `rgba(${this.color},${this.alpha * 0.15})`)
                lineGrad.addColorStop(1, `rgba(${this.color},${this.alpha * 0.9})`)
                ctx.beginPath()
                ctx.moveTo(tailX, tailY)
                ctx.lineTo(this.x, this.y)
                ctx.strokeStyle = lineGrad
                ctx.lineWidth = this.width
                ctx.stroke()
            }
        }

        // ── Floating dust particles (Your Name atmosphere) ────────
        const dust = Array.from({ length: 60 }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            r: Math.random() * 1.5 + 0.3,
            alpha: Math.random() * 0.15 + 0.03,
            vx: (Math.random() - 0.5) * 0.15,
            vy: -Math.random() * 0.12 - 0.04,
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: Math.random() * 0.02 + 0.005,
        }))

        // Spawn 4 comets with staggered delays
        const comets = [
            new Comet(0),
            new Comet(90),
            new Comet(160),
            new Comet(240),
        ]

        // ── Draw background gradient ──────────────────────────────
        const drawBg = () => {
            const bg = ctx.createRadialGradient(W * 0.5, H, 0, W * 0.5, H * 0.5, H)
            bg.addColorStop(0, "#000005")
            bg.addColorStop(0.4, "#03030f")
            bg.addColorStop(0.7, "#060818")
            bg.addColorStop(1, "#0a0e24")
            ctx.fillStyle = bg
            ctx.fillRect(0, 0, W, H)
        }

        // ── Main loop ─────────────────────────────────────────────
        const loop = () => {
            ctx.clearRect(0, 0, W, H)
            drawBg()

            // Twinkling stars
            stars.forEach(s => {
                s.alpha += s.twinkleSpeed * s.twinkleDir
                if (s.alpha > 0.8 || s.alpha < 0.05) s.twinkleDir *= -1
                ctx.beginPath()
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(255,255,255,${s.alpha})`
                ctx.fill()
            })

            // Floating dust
            dust.forEach(d => {
                d.x += d.vx
                d.y += d.vy
                d.pulse += d.pulseSpeed
                if (d.y < -5) { d.y = H + 5; d.x = Math.random() * W }
                if (d.x < -5) d.x = W + 5
                if (d.x > W + 5) d.x = -5
                const a = d.alpha * (0.7 + 0.3 * Math.sin(d.pulse))
                ctx.beginPath()
                ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(180,200,255,${a})`
                ctx.fill()
            })

            // Comets
            comets.forEach(c => { c.update(); c.draw(ctx) })

            animId = requestAnimationFrame(loop)
        }

        loop()

        return () => {
            cancelAnimationFrame(animId)
            window.removeEventListener("resize", resize)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full"
            style={{ zIndex: 0, pointerEvents: "none" }}
        />
    )
}

export default memo(Background)
