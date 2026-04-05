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

        // ── Twinkling stars (only in upper sky area of photo) ─────
        const stars = Array.from({ length: 120 }, () => ({
            x: Math.random() * W,
            y: Math.random() * H * 0.62,   // only sky portion
            r: Math.random() * 1.3 + 0.3,
            alpha: Math.random() * 0.5 + 0.2,
            speed: Math.random() * 0.01 + 0.003,
            dir: Math.random() > 0.5 ? 1 : -1,
            // some stars get a soft blue/white hue
            hue: Math.random() > 0.7 ? "180,210,255" : "255,255,255",
        }))

        // ── Floating light orbs — dreamy slow drift ───────────────
        const orbs = Array.from({ length: 10 }, () => ({
            x: Math.random() * W,
            y: Math.random() * H * 0.6,
            r: Math.random() * 40 + 15,
            alpha: Math.random() * 0.04 + 0.01,
            vx: (Math.random() - 0.5) * 0.18,
            vy: -Math.random() * 0.1 - 0.03,
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: Math.random() * 0.008 + 0.003,
        }))

        // ── Shooting / comet stars ─────────────────────────────────
        class Comet {
            constructor(delay) {
                this.spawnTimer = delay
                this.waiting = true
                this.init()
            }
            init() {
                this.x = Math.random() * W * 0.8
                this.y = Math.random() * H * 0.45
                this.angle = Math.random() * 18 + 22
                this.speed = Math.random() * 5 + 4
                this.vx = Math.cos((this.angle * Math.PI) / 180) * this.speed
                this.vy = Math.sin((this.angle * Math.PI) / 180) * this.speed
                this.len = Math.random() * 160 + 80
                this.lineW = Math.random() * 1.2 + 0.5
                this.life = 0
                this.maxLife = Math.random() * 50 + 40
                this.alpha = 0
                this.glow = Math.random() * 5 + 3
                const cols = ["255,255,255", "200,225,255", "255,245,210"]
                this.color = cols[Math.floor(Math.random() * cols.length)]
                this.trail = []
            }
            update() {
                if (this.waiting) {
                    this.spawnTimer--
                    if (this.spawnTimer <= 0) this.waiting = false
                    return
                }
                this.trail.push({ x: this.x, y: this.y })
                if (this.trail.length > 22) this.trail.shift()
                this.x += this.vx
                this.y += this.vy
                this.life++
                if (this.life < 10) this.alpha = this.life / 10
                else if (this.life > this.maxLife - 12) this.alpha = Math.max(0, (this.maxLife - this.life) / 12)
                else this.alpha = 1

                if (this.life >= this.maxLife) {
                    this.init()
                    this.waiting = true
                    this.spawnTimer = Math.random() * 200 + 100
                }
            }
            draw(ctx) {
                if (this.waiting || this.alpha <= 0) return

                // Tail
                for (let i = 0; i < this.trail.length; i++) {
                    const prog = i / this.trail.length
                    ctx.beginPath()
                    ctx.arc(this.trail[i].x, this.trail[i].y, this.lineW * prog * 0.8, 0, Math.PI * 2)
                    ctx.fillStyle = `rgba(${this.color},${this.alpha * prog * 0.35})`
                    ctx.fill()
                }

                // Glow head
                const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.glow * 2.5)
                g.addColorStop(0, `rgba(${this.color},${this.alpha * 0.95})`)
                g.addColorStop(0.5, `rgba(${this.color},${this.alpha * 0.3})`)
                g.addColorStop(1, `rgba(${this.color},0)`)
                ctx.beginPath()
                ctx.arc(this.x, this.y, this.glow * 2.5, 0, Math.PI * 2)
                ctx.fillStyle = g
                ctx.fill()

                // Streak
                const tx = this.x - this.vx * (this.len / this.speed)
                const ty = this.y - this.vy * (this.len / this.speed)
                const lg = ctx.createLinearGradient(tx, ty, this.x, this.y)
                lg.addColorStop(0, `rgba(${this.color},0)`)
                lg.addColorStop(0.7, `rgba(${this.color},${this.alpha * 0.12})`)
                lg.addColorStop(1, `rgba(${this.color},${this.alpha * 0.85})`)
                ctx.beginPath()
                ctx.moveTo(tx, ty)
                ctx.lineTo(this.x, this.y)
                ctx.strokeStyle = lg
                ctx.lineWidth = this.lineW
                ctx.stroke()
            }
        }

        // ── Distant light flickers (the red lights at horizon) ────
        const horizonLights = Array.from({ length: 6 }, (_, i) => ({
            x: W * 0.35 + i * W * 0.06 + (Math.random() - 0.5) * 30,
            y: H * 0.865,
            r: Math.random() * 3 + 2,
            alpha: Math.random() * 0.5 + 0.4,
            speed: Math.random() * 0.03 + 0.01,
            dir: Math.random() > 0.5 ? 1 : -1,
        }))

        const comets = [new Comet(30), new Comet(130), new Comet(220), new Comet(310)]

        // ── Render loop ───────────────────────────────────────────
        let frame = 0
        const loop = () => {
            frame++
            ctx.clearRect(0, 0, W, H)

            // Twinkling stars
            stars.forEach(s => {
                s.alpha += s.speed * s.dir
                if (s.alpha > 0.85 || s.alpha < 0.08) s.dir *= -1
                // soft glow for brighter stars
                if (s.r > 0.9) {
                    const sg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3)
                    sg.addColorStop(0, `rgba(${s.hue},${s.alpha})`)
                    sg.addColorStop(1, `rgba(${s.hue},0)`)
                    ctx.beginPath()
                    ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2)
                    ctx.fillStyle = sg
                    ctx.fill()
                }
                ctx.beginPath()
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(${s.hue},${s.alpha})`
                ctx.fill()
            })

            // Floating orbs
            orbs.forEach(o => {
                o.x += o.vx
                o.y += o.vy
                o.pulse += o.pulseSpeed
                if (o.y < -80) { o.y = H * 0.65; o.x = Math.random() * W }
                if (o.x < -80) o.x = W + 80
                if (o.x > W + 80) o.x = -80
                const a = o.alpha * (0.6 + 0.4 * Math.sin(o.pulse))
                const og = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r)
                og.addColorStop(0, `rgba(160,195,255,${a})`)
                og.addColorStop(1, `rgba(160,195,255,0)`)
                ctx.beginPath()
                ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2)
                ctx.fillStyle = og
                ctx.fill()
            })

            // Horizon red lights flicker
            horizonLights.forEach(l => {
                l.alpha += l.speed * l.dir
                if (l.alpha > 0.95 || l.alpha < 0.25) l.dir *= -1
                const lg = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.r * 4)
                lg.addColorStop(0, `rgba(255,80,30,${l.alpha})`)
                lg.addColorStop(0.5, `rgba(255,60,10,${l.alpha * 0.4})`)
                lg.addColorStop(1, `rgba(255,40,0,0)`)
                ctx.beginPath()
                ctx.arc(l.x, l.y, l.r * 4, 0, Math.PI * 2)
                ctx.fillStyle = lg
                ctx.fill()
                ctx.beginPath()
                ctx.arc(l.x, l.y, l.r, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(255,120,60,${l.alpha})`
                ctx.fill()
            })

            // Comets
            comets.forEach(c => { c.update(); c.draw(ctx) })

            // Subtle blue window-light shimmer on left edge
            const shimmer = 0.04 + 0.015 * Math.sin(frame * 0.012)
            const wg = ctx.createLinearGradient(0, 0, W * 0.18, 0)
            wg.addColorStop(0, `rgba(60,100,220,${shimmer})`)
            wg.addColorStop(1, `rgba(60,100,220,0)`)
            ctx.fillStyle = wg
            ctx.fillRect(0, 0, W * 0.18, H)

            animId = requestAnimationFrame(loop)
        }

        loop()

        return () => {
            cancelAnimationFrame(animId)
            window.removeEventListener("resize", resize)
        }
    }, [])

    return (
        <>
            {/* Your actual photo as background */}
            <div
                className="fixed inset-0 -z-10"
                style={{
                    backgroundImage: "url('/night-bg.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    filter: "brightness(0.85)",
                }}
            />

            {/* Live canvas animation on top */}
            <canvas
                ref={canvasRef}
                className="fixed inset-0 w-full h-full"
                style={{ zIndex: 1, pointerEvents: "none" }}
            />
        </>
    )
}

export default memo(Background)
