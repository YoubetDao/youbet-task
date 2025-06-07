import { motion } from 'framer-motion'
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
          <motion.div
            animate={{
              opacity: [0, 1, 1, 0],
              y: [20, 0, 0, -20],
            }}
            transition={{
              duration: 5,
              times: [0, 0.1, 0.9, 1],
              repeat: Infinity,
              repeatDelay: 0,
            }}
            className="flex h-16 items-center justify-center"
          >
            <h1 className="text-4xl font-bold text-transparent text-white md:text-6xl">{slogans[currentSlogan]}</h1>
          </motion.div>
          <p className="mx-auto mb-6 mt-8 max-w-[450px] text-xl text-white ">
            A next-generation platform that automatically evaluates and fairly rewards every open-source contribution.
          </p>

          <div className="flex justify-center space-x-4">
            {/* <RainbowButton onClick={() => navigate('/dashboard', { replace: true })}>Go to app</RainbowButton> */}

            <button
              className="flex w-max cursor-pointer items-center justify-center rounded-[10px] bg-white px-4 py-2.5 text-black transition-opacity hover:opacity-90"
              onClick={() => navigate('/dashboard', { replace: true })}
            >
              Go to app
            </button>
          </div>
          {/* <button
            className="btn tw-group max-lg:!tw-w-[160px] tw-flex tw-gap-2 tw-shadow-lg !tw-w-[170px] !tw-rounded-xl !tw-py-4 max-lg:!tw-py-2 tw-transition-transform tw-duration-[0.3s] hover:tw-scale-x-[1.03]"
            onClick={() => navigate('/dashboard', { replace: true })}
          >
            <span>Go to app</span>
            <i className="bi bi-arrow-right group-hover:tw-translate-x-1 tw-duration-300"></i>
          </button> */}
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
