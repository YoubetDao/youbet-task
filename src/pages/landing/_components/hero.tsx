import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const slogans = ['Collaborate Smarter, Not Harder', 'To Reward Every Effort']

const Hero = () => {
  const [currentSlogan, setCurrentSlogan] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlogan((prev) => (prev + 1) % slogans.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])
  return (
    <section className="relative mt-[200px] flex pb-24">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="-translate-y-1/3 transform"
        >
          <h1 className="text-4xl font-bold text-transparent text-white md:text-6xl">
            Where solo developers build together
          </h1>
          <p className="mx-auto mb-6 mt-8 max-w-[550px] text-xl text-white ">
            A trustless coordination layer for developers — turning code into contributions, and contributions into
            rewards.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              className="flex w-max cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-white bg-black px-4 py-2.5 text-white transition-opacity hover:opacity-90"
              href="https://github.com/YoubetDao"
              target="_blank"
              rel="noreferrer"
            >
              About us
            </a>
            <button
              className="flex w-max cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-white px-4 py-2.5 text-black transition-opacity hover:opacity-90"
              onClick={() => navigate('/dashboard', { replace: true })}
            >
              Go to app
              <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
