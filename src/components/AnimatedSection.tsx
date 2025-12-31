'use client'

import { useEffect, useRef, ReactNode, CSSProperties } from 'react'
import { animate, stagger } from 'animejs'

interface AnimatedSectionProps {
  children: ReactNode
  animation?:
    | 'fadeInUp'
    | 'fadeInDown'
    | 'fadeInLeft'
    | 'fadeInRight'
    | 'scaleIn'
    | 'slideInFromBottom'
    | 'bounce'
  delay?: number
  duration?: number
  className?: string
  style?: CSSProperties
  once?: boolean
  threshold?: number
}

const animationConfigs = {
  fadeInUp: {
    opacity: [0, 1],
    translateY: [40, 0],
  },
  fadeInDown: {
    opacity: [0, 1],
    translateY: [-40, 0],
  },
  fadeInLeft: {
    opacity: [0, 1],
    translateX: [-40, 0],
  },
  fadeInRight: {
    opacity: [0, 1],
    translateX: [40, 0],
  },
  scaleIn: {
    opacity: [0, 1],
    scale: [0.9, 1],
  },
  slideInFromBottom: {
    opacity: [0, 1],
    translateY: [100, 0],
  },
  bounce: {
    opacity: [0, 1],
    translateY: [40, 0],
  },
}

export default function AnimatedSection({
  children,
  animation = 'fadeInUp',
  delay = 0,
  duration = 800,
  className = '',
  style,
  once = true,
  threshold = 0.1,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Set initial state
    element.style.opacity = '0'

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (once && hasAnimated.current) return
          hasAnimated.current = true

          const config = animationConfigs[animation]

          animate(element, {
            ...config,
            duration,
            delay,
            ease: animation === 'bounce' ? 'outBounce' : 'outQuad',
          })
        }
      },
      { threshold }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [animation, delay, duration, once, threshold])

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}

// Staggered children animation component
interface StaggeredChildrenProps {
  children: ReactNode
  className?: string
  childClassName?: string
  staggerDelay?: number
  duration?: number
  once?: boolean
  threshold?: number
}

export function StaggeredChildren({
  children,
  className = '',
  childClassName = 'stagger-child',
  staggerDelay = 100,
  duration = 600,
  once = true,
  threshold = 0.1,
}: StaggeredChildrenProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const childElements = container.querySelectorAll(`.${childClassName}`)
    if (childElements.length === 0) return

    // Set initial state
    childElements.forEach((child) => {
      if (child instanceof HTMLElement) {
        child.style.opacity = '0'
        child.style.transform = 'translateY(30px)'
      }
    })

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (once && hasAnimated.current) return
          hasAnimated.current = true

          animate(childElements, {
            opacity: [0, 1],
            translateY: [30, 0],
            duration,
            delay: stagger(staggerDelay),
            ease: 'outQuad',
          })
        }
      },
      { threshold }
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [childClassName, staggerDelay, duration, once, threshold])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}

// Floating animation component
interface FloatingElementProps {
  children: ReactNode
  className?: string
  amplitude?: number
  duration?: number
}

export function FloatingElement({
  children,
  className = '',
  amplitude = 10,
  duration = 3000,
}: FloatingElementProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const animation = animate(element, {
      translateY: [amplitude, -amplitude],
      duration,
      loop: true,
      alternate: true,
      ease: 'inOutSine',
    })

    return () => animation.pause()
  }, [amplitude, duration])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

// Parallax scroll component
interface ParallaxElementProps {
  children: ReactNode
  className?: string
  speed?: number
}

export function ParallaxElement({
  children,
  className = '',
  speed = 0.5,
}: ParallaxElementProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleScroll = () => {
      const rect = element.getBoundingClientRect()
      const scrolled = window.scrollY
      const offsetY = (scrolled - rect.top) * speed

      element.style.transform = `translateY(${offsetY}px)`
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

// Counter animation component
interface AnimatedCounterProps {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
}

export function AnimatedCounter({
  end,
  duration = 2000,
  suffix = '',
  prefix = '',
  className = '',
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true

          const obj = { value: 0 }
          animate(obj, {
            value: end,
            duration,
            modifier: (v: number) => Math.round(v),
            ease: 'outExpo',
            onUpdate: () => {
              element.textContent = `${prefix}${obj.value}${suffix}`
            },
          })
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [end, duration, suffix, prefix])

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  )
}
