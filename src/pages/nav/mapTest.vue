<template>
  <div class="main">
    <div class="map-container">
      <canvas id="canvas" ref="canvas" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { onMounted, ref } from 'vue'
import mapMotionPoints from '../../jsons/mapMotionPoints.json'

interface Point {
  x: number
  y: number
  alpha: number
}

interface Meteor {
  t: number
  alpha: number
  tail: { x: number, y: number, alpha: number }[]
}

interface Animation {
  startPoint: Point
  endPoint: Point
  controlPoint: Point
  meteor: Meteor
  curveAlpha: number
  meteorDuration: number
}

// 动画速度参数
const POINT_DURATION = 0.5 // 点出现时间（秒）
const CURVE_DURATION = 0.5 // 曲线出现时间（秒）
const FADE_DURATION = 0.5 // 淡出时间（秒）
const METEOR_SPEED_FACTOR = 0.03 // 流星移动速度因子（秒/像素）

// 透明度控制参数
const POINT_MAX_ALPHA = 1 // 点最大透明度（0-1）
const CURVE_MAX_ALPHA = 0.2 // 曲线最大透明度（0-1）
const METEOR_MAX_ALPHA = 1 // 流星最大透明度（0-1）

const startPoints = mapMotionPoints.startPoints
const endPoints = mapMotionPoints.endPoints
const animations: Animation[] = []

function createAnimation(): Animation {
  const startIdx = Math.floor(Math.random() * startPoints.length)
  const endIdx = Math.floor(Math.random() * endPoints.length)
  const start = startPoints[startIdx]
  const end = endPoints[endIdx]
  const dx = end.x - start.x
  const dy = end.y - start.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  const meteorDuration = distance * METEOR_SPEED_FACTOR
  const midX = (start.x + end.x) / 2
  const midY = (start.y + end.y) / 2
  const offset = 100 // 控制点偏移范围
  const controlX = midX + (Math.random() - 0.5) * offset
  const controlY = midY + (Math.random() - 0.5) * offset
  const startPoint: Point = { x: start.x, y: start.y, alpha: 0 }
  const endPoint: Point = { x: end.x, y: end.y, alpha: 0 }
  const controlPoint: Point = { x: controlX, y: controlY, alpha: 1 }
  const meteor: Meteor = { t: 0, alpha: METEOR_MAX_ALPHA, tail: [] }
  return { startPoint, endPoint, controlPoint, meteor, curveAlpha: 0, meteorDuration }
}

const canvas = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  if (!canvas.value)
    return
  const ctx = canvas.value.getContext('2d') as CanvasRenderingContext2D
  canvas.value.width = 800
  canvas.value.height = 400

  function drawPoint(ctx: CanvasRenderingContext2D, x: number, y: number, alpha: number): void {
    ctx.beginPath()
    ctx.arc(x, y, 3, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(0, 112, 80, ${alpha * POINT_MAX_ALPHA})`
    ctx.fill()
  }

  function drawBezierCurve(ctx: CanvasRenderingContext2D, progress: number, alpha: number, start: Point, control: Point, end: Point): void {
    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    for (let t = 0; t <= progress; t += 0.01) {
      const x = (1 - t) ** 2 * start.x + 2 * (1 - t) * t * control.x + t ** 2 * end.x
      const y = (1 - t) ** 2 * start.y + 2 * (1 - t) * t * control.y + t ** 2 * end.y
      ctx.lineTo(x, y)
    }
    ctx.strokeStyle = `rgba(0, 112, 80, ${alpha * CURVE_MAX_ALPHA})`
    ctx.lineWidth = 2
    ctx.stroke()
  }

  function drawMeteor(ctx: CanvasRenderingContext2D, t: number, alpha: number, meteor: Meteor, start: Point, control: Point, end: Point): void {
    const x = (1 - t) ** 2 * start.x + 2 * (1 - t) * t * control.x + t ** 2 * end.x
    const y = (1 - t) ** 2 * start.y + 2 * (1 - t) * t * control.y + t ** 2 * end.y
    meteor.tail.push({ x, y, alpha: METEOR_MAX_ALPHA })
    if (meteor.tail.length > 100)
      meteor.tail.shift()

    // 绘制彗尾
    ctx.beginPath()
    meteor.tail.forEach((p, i) => {
      const tailProgress = i / (meteor.tail.length - 1)
      const tailAlpha = p.alpha * (1 - tailProgress) ** 1.5 * alpha * METEOR_MAX_ALPHA // 从头部到尾部逐渐透明
      const lineWidth = 4 * tailProgress + 1 // 线宽从头部到尾部逐渐减小
      ctx.lineTo(p.x, p.y)
      ctx.strokeStyle = `rgba(0, 112, 80, ${tailAlpha})`
      ctx.lineWidth = lineWidth
      if (i === 0)
        ctx.moveTo(p.x, p.y)
      else ctx.stroke()
    })

    // 绘制彗星头部
    ctx.beginPath()
    ctx.arc(x, y, 1, 0, Math.PI * 2) // 头部稍大以突出效果
    ctx.fillStyle = `rgba(0, 112, 80, ${alpha * METEOR_MAX_ALPHA})` // 保持彗星头部原始透明度
    ctx.fill()
  }

  function drawAll() {
    ctx.clearRect(0, 0, canvas.value!.width, canvas.value!.height)
    animations.forEach((anim) => {
      drawPoint(ctx, anim.startPoint.x, anim.startPoint.y, anim.startPoint.alpha)
      drawPoint(ctx, anim.endPoint.x, anim.endPoint.y, anim.endPoint.alpha)
      drawBezierCurve(ctx, anim.curveAlpha, anim.curveAlpha, anim.startPoint, anim.controlPoint, anim.endPoint)
      if (anim.meteor.t > 0 || anim.curveAlpha < 1) {
        drawMeteor(ctx, anim.meteor.t, anim.meteor.alpha, anim.meteor, anim.startPoint, anim.controlPoint, anim.endPoint)
      }
    })
  }

  function startAnimation(anim: Animation) {
    const timeline = gsap.timeline({
      onComplete: () => {
        const index = animations.indexOf(anim)
        if (index !== -1) {
          animations.splice(index, 1)
          const newAnim = createAnimation()
          animations.push(newAnim)
          startAnimation(newAnim)
        }
      },
      onUpdate: drawAll,
    })

    timeline
      .to([anim.startPoint, anim.endPoint], { alpha: 1, duration: POINT_DURATION })
      .to(anim, { curveAlpha: 1, duration: CURVE_DURATION })
      .to(anim.meteor, { t: 1, duration: anim.meteorDuration, ease: 'linear' })
      .to([anim.startPoint, anim.endPoint, anim, anim.meteor], { alpha: 0, curveAlpha: 0, duration: FADE_DURATION })
  }

  for (let i = 0; i < 3; i++) {
    const anim = createAnimation()
    animations.push(anim)
    startAnimation(anim)
  }

  // 初始绘制
  drawAll()
})
</script>

<style scoped>
.main {
  background-color: #eee;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.map-container {
  width: 800px;
  height: 400px;
  background-image: url(../../assets/map_bg.png);
  background-size: cover;
  background-position: center;
  position: relative;
}
canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
}
</style>
