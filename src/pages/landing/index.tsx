import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Radar, LineChart, Wallet, Award, Boxes, ArrowRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PartnersSection } from './_components/partners-section'

interface Feature {
  title: string
  description: string
  icon: LucideIcon
}

const features: { enterprise: Feature[]; individual: Feature[] } = {
  enterprise: [
    {
      title: 'Enterprise Project Management',
      description: 'Robust task management, GitHub integration, and decentralized workflow empowerment.',
      icon: Boxes,
    },
    {
      title: 'Automated Rewards Distribution',
      description: 'Fair and efficient reward distribution with diverse allocation strategies.',
      icon: Award,
    },
    {
      title: 'Optimize Processes, Boost Productivity',
      description: 'Track workflow data, create feedback loops, enhance team productivity and error correction.',
      icon: Sparkles,
    },
  ],
  individual: [
    {
      title: 'Smart Project Radar',
      description: 'Discover top projects and tasks, connecting developers with opportunities.',
      icon: Radar,
    },
    {
      title: 'Track Contributions, Showcase Impact',
      description: 'On-chain contribution recording for an accurate Developer Influence Score.',
      icon: LineChart,
    },
    {
      title: 'Powerful Payment System',
      description: 'Multi-chain and traditional payments to wallets or third-party accounts.',
      icon: Wallet,
    },
  ],
}

const slogans = ['Collaborate Smarter, Not Harder', 'To Reward Every Effort']

export default function LandingPage() {
  const [currentSlogan, setCurrentSlogan] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlogan((prev) => (prev + 1) % slogans.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const StatCard = ({ value, label, delay = 0 }: { value: string; label: string; delay?: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="rounded-lg bg-slate-800/50 p-4 text-center"
    >
      <div className="mb-2 text-4xl font-bold text-purple-400 md:text-5xl">{value}</div>
      <div className="text-sm text-slate-400 md:text-base">{label}</div>
    </motion.div>
  )

  const FeatureCard = ({ icon: Icon, title, description, delay = 0 }: Feature & { delay?: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="h-full"
    >
      <Card className="group h-full border-slate-700 bg-slate-800/50 transition-colors duration-300 hover:border-purple-500/70">
        <CardHeader>
          <div className="mb-4 inline-block rounded-lg bg-purple-500/10 p-3 transition-colors duration-300 group-hover:bg-purple-500/20">
            <Icon className="h-8 w-8 text-purple-400" />
          </div>
          <CardTitle className="text-xl font-semibold text-slate-100 transition-colors duration-300 group-hover:text-purple-300">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400 transition-colors duration-300 group-hover:text-slate-300">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-slate-100">
      <main className="relative overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative flex min-h-screen items-center justify-center py-24">
          <div className="absolute inset-0 -z-10">
            <div className="animate-pulse-slow absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-purple-600/20 opacity-50 blur-3xl filter"></div>
            <div className="animate-pulse-slow animation-delay-2000 absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-pink-500/20 opacity-50 blur-3xl filter"></div>
          </div>
          <div className="container mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="mb-4 flex h-20 items-center justify-center">
                {' '}
                {/* Increased height for slogan */}
                <AnimatePresence mode="wait">
                  <motion.h1
                    key={currentSlogan}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-4xl font-bold text-transparent md:text-6xl"
                  >
                    {slogans[currentSlogan]}
                  </motion.h1>
                </AnimatePresence>
              </div>
              <p className="mx-auto mb-6 max-w-2xl text-xl text-slate-300 md:text-2xl">
                Evaluating and rewarding every contribution in next-gen decentralized collaboration.
              </p>
              <p className="mx-auto mb-10 max-w-3xl text-lg text-slate-400 md:text-xl">
                A cutting-edge platform for automated and fair reward distribution to open source developers based on
                their contributions.
              </p>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Button
                  size="lg"
                  onClick={() => navigate('/dashboard')}
                  className="group rounded-lg bg-purple-600 px-8 py-6 text-lg font-semibold text-white hover:bg-purple-700"
                >
                  Go to App
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* User Stats Section */}
        <section className="bg-slate-900/30 py-16 backdrop-blur-sm md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center md:mb-16">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                  Platform Impact
                </span>
              </h2>
              <p className="mx-auto max-w-xl text-lg text-slate-400 md:text-xl">
                Join thousands of developers and projects already thriving with According.Work.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
              <StatCard value="700+" label="Active Developers" delay={0} />
              <StatCard value="100+" label="Projects" delay={0.1} />
              <StatCard value="1k+" label="Total Tasks" delay={0.2} />
              <StatCard value="500+" label="Delivered Tasks" delay={0.3} />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative py-16 md:py-24">
          <div className="absolute inset-0 -z-10 opacity-30">
            <div className="absolute left-0 top-0 h-full w-1/2 bg-gradient-to-br from-purple-600/30 to-transparent blur-3xl filter"></div>
            <div className="absolute bottom-0 right-0 h-full w-1/2 bg-gradient-to-tl from-pink-500/30 to-transparent blur-3xl filter"></div>
          </div>
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center md:mb-16">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                  Platform Features
                </span>
              </h2>
              <p className="mx-auto max-w-xl text-lg text-slate-400 md:text-xl">
                Powerful tools for decentralized collaboration and fair reward distribution.
              </p>
            </div>

            {/* Enterprise Features */}
            <div className="mb-16 md:mb-24">
              <h3 className="mb-10 text-center text-2xl font-semibold text-slate-200 md:mb-12 md:text-3xl">
                Enterprise Solutions
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
                {features.enterprise.map((feature, i) => (
                  <FeatureCard key={i} {...feature} delay={i * 0.1} />
                ))}
              </div>
            </div>

            {/* Individual Features */}
            <div>
              <h3 className="mb-10 text-center text-2xl font-semibold text-slate-200 md:mb-12 md:text-3xl">
                Individual Developer Tools
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
                {features.individual.map((feature, i) => (
                  <FeatureCard key={i} {...feature} delay={i * 0.1} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <PartnersSection />

        {/* Footer */}
        <footer className="border-t border-slate-800 bg-slate-950/50 py-12">
          <div className="container mx-auto px-4 text-center text-slate-500">
            <p>&copy; {new Date().getFullYear()} According.Work. All rights reserved.</p>
            <p className="mt-2 text-sm">Decentralized Collaboration, Rewarded.</p>
          </div>
        </footer>
      </main>
    </div>
  )
}
