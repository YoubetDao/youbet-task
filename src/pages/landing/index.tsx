import { motion } from 'framer-motion'
import { RainbowButton } from '@/components/ui/rainbow-button'
import { Sparkles, Radar, LineChart, Wallet, Award, Boxes } from 'lucide-react'
import { ShineBorder } from '@/components/ui/shine-border'
import { BackgroundCanvas } from '@/components/ui/background-canvas'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PartnersSection } from './_components/partners-section'

const features = {
  enterprise: [
    {
      title: 'Enterprise-grade Project Management',
      description:
        'A robust task management system designed to integrate smoothly with GitHub and empower decentralized workflows.',
      icon: Boxes,
    },
    {
      title: 'Automated Rewards Distribution',
      description:
        'Distribute rewards automatically with diverse allocation strategies to ensure fairness and efficiency.',
      icon: Award,
    },
    {
      title: 'Optimize Processes, Boost Productivity',
      description:
        'Track and record workflow data in software development, creating a robust and efficient feedback loop to enhance team productivity and error correction.',
      icon: Sparkles,
    },
  ],
  individual: [
    {
      title: 'Smart Project Radar',
      description: 'Discover top projects and tasks, effectively bridging developers with the right opportunities.',
      icon: Radar,
    },
    {
      title: 'Track Contributions, Showcase Impact',
      description:
        'Record contributions on-chain to create an accurate Developer Influence Score, showcasing true capabilities.',
      icon: LineChart,
    },
    {
      title: 'Powerful Payment System',
      description: 'Pay wallets or third-party accounts across multiple chains or through traditional payment methods.',
      icon: Wallet,
    },
  ],
}

const slogans = ['Collaborate Smarter, Not Harder', 'To Reward Every Effort']

const LandingPage = () => {
  const [currentSlogan, setCurrentSlogan] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlogan((prev) => (prev + 1) % slogans.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <BackgroundCanvas />
      <main className="relative">
        <div className="min-h-screen">
          {/* Hero Section */}
          <section className="relative flex py-24">
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
                  <h1 className="mb-8 bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800 bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
                    {slogans[currentSlogan]}
                  </h1>
                </motion.div>
                <p className="mb-6 text-xl text-muted-foreground md:text-2xl">
                  Evaluating and rewarding every contribution in next-gen decentralized collaboration
                </p>
                <p className="mb-8 text-lg text-muted-foreground md:text-xl">
                  A cutting-edge platform for automated and fair reward distribution to open source developers based on
                  their contributions.
                </p>
                <div className="space-x-4">
                  <RainbowButton onClick={() => navigate('/dashboard', { replace: true })}>Go to app</RainbowButton>
                </div>
              </motion.div>
            </div>
          </section>

          {/* User Stats Section */}
          <section className="py-24">
            <div className="container mx-auto px-4">
              <div className="text-center">
                <h2 className="mb-8 bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800 bg-clip-text text-2xl font-bold text-transparent md:text-4xl">
                  Platform Impact
                </h2>
                <p className="mb-12 text-lg text-muted-foreground md:text-xl">
                  Join thousands of developers and projects already using According.work
                </p>
              </div>
              <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="mb-2 text-4xl font-bold text-purple-400 md:text-5xl">700+</div>
                  <div className="text-sm text-muted-foreground md:text-base">Active Developers</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="mb-2 text-4xl font-bold text-purple-400 md:text-5xl">100+</div>
                  <div className="text-sm text-muted-foreground md:text-base">Projects</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="mb-2 text-4xl font-bold text-purple-400 md:text-5xl">1k+</div>
                  <div className="text-sm text-muted-foreground md:text-base">Total Tasks</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="mb-2 text-4xl font-bold text-purple-400 md:text-5xl">500+</div>
                  <div className="text-sm text-muted-foreground md:text-base">Delivered Tasks</div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="relative overflow-hidden py-24">
            <div className="pointer-events-none absolute inset-0 from-purple-900/20 to-transparent" />
            <div className="container mx-auto px-4">
              <div className="relative text-center">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 blur-3xl" />
                <h2 className="relative mb-8 bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800 bg-clip-text text-2xl font-bold text-transparent md:text-4xl">
                  Platform Features
                </h2>
                <p className="relative mb-8 text-lg text-muted-foreground md:text-xl">
                  Our platform offers powerful tools for decentralized collaboration and fair reward distribution
                </p>
              </div>

              {/* Enterprise Features */}
              <div className="relative mb-24">
                <div className="absolute -left-20 top-1/2 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl" />
                <div className="absolute -right-20 top-1/2 h-40 w-40 rounded-full bg-pink-500/20 blur-3xl" />
                <h3 className="mb-12 text-center text-2xl font-semibold text-white md:text-3xl">
                  <span className="bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800 bg-clip-text text-transparent">
                    Enterprise Solutions
                  </span>
                </h3>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                  {features.enterprise.map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className="group h-full"
                    >
                      <ShineBorder
                        className="relative flex h-full flex-col overflow-hidden rounded-2xl border bg-background/50 p-8 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
                        color={['#A07CFE', '#FE8FB5', '#FFBE7B']}
                      >
                        <div className="relative z-10 flex h-full flex-col">
                          <div className="mb-6 inline-block rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-3 transition-transform duration-300 group-hover:scale-110">
                            <feature.icon className="h-8 w-8 text-purple-400" />
                          </div>
                          <h3 className="mb-4 bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800 bg-clip-text text-xl font-semibold text-transparent">
                            {feature.title}
                          </h3>
                          <p className="text-gray-400 transition-colors group-hover:text-gray-300">
                            {feature.description}
                          </p>
                        </div>
                        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 blur-3xl transition-all duration-300 group-hover:from-purple-500/40 group-hover:to-pink-500/40" />
                      </ShineBorder>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Individual Features */}
              <div className="relative">
                <div className="absolute -left-20 top-1/2 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl" />
                <div className="absolute -right-20 top-1/2 h-40 w-40 rounded-full bg-pink-500/20 blur-3xl" />
                <h3 className="mb-12 text-center text-2xl font-semibold text-white md:text-3xl">
                  <span className="bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800 bg-clip-text text-transparent">
                    Individual Developer Tools
                  </span>
                </h3>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                  {features.individual.map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className="group h-full"
                    >
                      <ShineBorder
                        className="relative flex h-full flex-col overflow-hidden rounded-2xl border bg-background/50 p-8 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
                        color={['#A07CFE', '#FE8FB5', '#FFBE7B']}
                      >
                        <div className="relative z-10 flex h-full flex-col">
                          <div className="mb-6 inline-block rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-3 transition-transform duration-300 group-hover:scale-110">
                            <feature.icon className="h-8 w-8 text-purple-400" />
                          </div>
                          <h3 className="mb-4 bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800 bg-clip-text text-xl font-semibold text-transparent">
                            {feature.title}
                          </h3>
                          <p className="text-gray-400 transition-colors group-hover:text-gray-300">
                            {feature.description}
                          </p>
                        </div>
                        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 blur-3xl transition-all duration-300 group-hover:from-purple-500/40 group-hover:to-pink-500/40" />
                      </ShineBorder>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <PartnersSection />
        </div>
      </main>
    </>
  )
}

export default LandingPage
