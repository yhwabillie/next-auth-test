'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

interface ProvidersProps {
  children: React.ReactNode
}

export const FramerMotionProvider = ({ children }: ProvidersProps) => {
  const pathname = usePathname()

  const anim = (variants: any) => {
    return {
      initial: 'initial',
      animate: 'enter',
      exit: 'exit',
      variants,
    }
  }

  const pageTransition = {
    initial: {
      opacity: 0,
      x: -100,
    },
    enter: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: [0.76, 0, 0.24, 1],
      },
    },
    exist: {
      opacity: 1,
      x: 100,
    },
  }

  return (
    <AnimatePresence mode="wait">
      <motion.main key={pathname} {...anim(pageTransition)}>
        {children}
      </motion.main>
    </AnimatePresence>
  )
}
