import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PartnersSection } from './partners-section'

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
    <section className="relative  flex h-screen flex-col justify-between ">
      <div className="container mx-auto mt-[200px] px-4 text-center">
        <div className="mx-auto mb-8  flex w-fit items-center gap-1 rounded-full border border-[#FFFFFF1A] bg-[#110D11] p-2 text-sm font-semibold">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-[#004FFF] to-[#8C00FF] text-sm">
            🏆
          </div>
          Polkadot Finalist & BNB AI Hacker Winner
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="translate-y-1/3 transform "
        >
          <h1 className="text-4xl font-bold text-transparent text-white md:text-6xl">
            Where solo developers build together
          </h1>
          <p className="mx-auto mt-10 max-w-[550px] text-xl text-white ">
            A trustless coordination layer for developers
          </p>
          <p className="mx-auto mb-10 max-w-[600px] text-xl text-white ">
            turning code into contributions, and contributions into rewards
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
      <PartnersSection />
    </section>
  )
}

export default Hero
