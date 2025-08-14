import { motion } from 'framer-motion'
import { Sparkles, Radar, LineChart, Wallet, Award, Boxes } from 'lucide-react'
import { ShineBorder } from '@/components/ui/shine-border'
import { BackgroundCanvas } from '@/components/ui/background-canvas'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserReviewsSection } from './_components/user-reviews-section'
import Hero from './_components/hero'

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
          <Hero />

          {/* User Stats Section */}
          <section className="py-24">
            <div className="container mx-auto px-4">
              <div className="text-center">
                <h2 className="mb-8 text-2xl font-bold text-transparent text-white md:text-4xl">Platform Impact</h2>
                <p className="mb-12 text-lg  md:text-xl">
                  Join thousands of developers and projects already using According.Work
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
                  <div className="mb-2 text-4xl font-bold  md:text-5xl">1k+</div>
                  <div className="text-sm text-muted-foreground md:text-base">Joined Developers</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="mb-2 text-4xl font-bold  md:text-5xl">100+</div>
                  <div className="text-sm text-muted-foreground md:text-base">Projects</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="mb-2 text-4xl font-bold  md:text-5xl">1k+</div>
                  <div className="text-sm text-muted-foreground md:text-base">Total Tasks</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="mb-2 text-4xl font-bold  md:text-5xl">500+</div>
                  <div className="text-sm text-muted-foreground md:text-base">Delivered Tasks</div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="relative overflow-hidden py-24">
            <div className="pointer-events-none absolute inset-0 from-purple-900/20 to-transparent" />
            <div className="container mx-auto px-4">
              <div className="relative text-center">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 blur-3xl" />
              </div>

              {/* Enterprise Features */}
              <div className="relative mb-24">
                <div className="absolute -left-20 top-1/2 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl" />
                <div className="absolute -right-20 top-1/2 h-40 w-40 rounded-full bg-pink-500/20 blur-3xl" />
                <h3 className="mb-12 text-center text-2xl font-semibold text-white md:text-3xl">
                  <span className="text-white">Scale Your Projects</span>
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
                      <ShineBorder className="relative flex h-full flex-col overflow-hidden rounded-2xl border bg-background/50 p-8 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
                        <div className="relative z-10 flex h-full flex-col">
                          <div className="mb-6 inline-block ">
                            <feature.icon className="h-8 w-8 " />
                          </div>
                          <h3 className="mb-4 text-xl font-semibold">{feature.title}</h3>
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
                  <span className="">Seek Meaningful Work</span>
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
                      <ShineBorder className="relative flex h-full flex-col overflow-hidden rounded-2xl border bg-background/50 p-8 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
                        <div className="relative z-10 flex h-full flex-col">
                          <div className="mb-6 inline-block">
                            <feature.icon className="h-8 w-8 " />
                          </div>
                          <h3 className="mb-4 text-xl font-semibold text-transparent text-white">{feature.title}</h3>
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

          <UserReviewsSection />

          {/* <PartnersSection /> */}
        </div>
      </main>
    </>
  )
}

export default LandingPage
