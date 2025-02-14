'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
    })

    const updateSize = () => {
      const width = window.innerWidth
      const height = Math.max(window.innerHeight, document.documentElement.scrollHeight)
      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    updateSize()

    const particlesGeometry = new THREE.BufferGeometry()
    const count = 7000

    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    const width = 20
    const height = document.documentElement.scrollHeight / 50

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * width
      positions[i + 1] = (Math.random() - 0.5) * height
      positions[i + 2] = (Math.random() - 0.5) * width

      const mixedColor = new THREE.Color()
      mixedColor.setHSL(Math.random() * 0.2 + 0.5, 0.7, 0.5)

      colors[i] = mixedColor.r
      colors[i + 1] = mixedColor.g
      colors[i + 2] = mixedColor.b
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.015,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
    })

    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particles)

    camera.position.z = 3

    const handleResize = () => {
      updateSize()
    }

    const handleScroll = () => {
      camera.position.y = -window.scrollY / window.innerHeight
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll)

    const animate = () => {
      requestAnimationFrame(animate)

      particles.rotation.x += 0.0001
      particles.rotation.y += 0.0002

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
      scene.remove(particles)
      particlesGeometry.dispose()
      particlesMaterial.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 h-full w-full"
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 50% 50%, rgba(13, 15, 19, 0.9) 0%, rgba(0, 0, 0, 0.95) 100%)',
      }}
    />
  )
}
