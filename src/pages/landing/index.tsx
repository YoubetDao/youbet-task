import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { RainbowButton } from '@/components/ui/rainbow-button'
import { Twitter, MessageCircle, Github, Award } from 'lucide-react'
import { ShineBorder } from '@/components/ui/shine-border'
import { BackgroundCanvas } from '@/components/ui/background-canvas'

const LandingPage = () => {
  const socialLinks = [
    {
      name: 'Twitter',
      url: 'https://x.com/youbetdao',
      icon: Twitter,
    },
    {
      name: 'Telegram',
      url: 'https://t.me/+_a-io1KqMIc5ZjQ9',
      icon: MessageCircle,
    },
    {
      name: 'GitHub',
      url: 'https://github.com/YoubetDao/',
      icon: Github,
    },
  ]

  const features = [
    {
      title: 'Optimize processes, boost productivity',
      description:
        'Track and record workflow data in software development, creating a robust and efficient feedback loop to enhance team productivity and error correction.',
      icon: () => <div />,
    },
    {
      title: 'Smart project radar, connecting developers to opportunities',
      description: 'Discover top projects and tasks, effectively bridging developers with the right opportunities.',
      icon: () => <div />,
    },
    {
      title: 'Track contributions, showcase true impact',
      description:
        'Record contributions on-chain to create an accurate Developer Influence Score, showcasing true capabilities.',
      icon: () => <div />,
    },
    {
      title: 'Powerful payments, tailored to your needs',
      description: 'Pay wallets or third-party accounts across multiple chains or through traditional payment methods.',
      icon: () => <div />,
    },
    {
      title: 'Automated rewards, fair and efficient',
      description:
        'Distribute rewards automatically with diverse allocation strategies to ensure fairness and efficiency.',
      icon: () => <div />,
    },
    {
      title: 'Enterprise-grade project management',
      description:
        'A robust task management system designed to integrate smoothly with GitHub and empower decentralized workflows.',
      icon: () => <div />,
    },
  ]

  const partners = [
    {
      name: 'Antalpha',
      logo: '/landing/partner-antalpha.svg',
    },
    {
      name: 'Openbuild',
      logo: '/landing/partner-openbuild.svg',
    },
    {
      name: 'Social Layer',
      logo: '/landing/partner-sociallayer.svg',
    },
  ]

  return (
    <>
      <BackgroundCanvas />
      <main className="relative">
        <div className="min-h-screen">
          {/* Hero Section */}
          <section className="relative mt-24 flex">
            <div className="container mx-auto px-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="-translate-y-1/3 transform"
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mb-12 inline-flex"
                >
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 backdrop-blur-sm transition-colors hover:bg-white/10"
                  >
                    <Award className="h-4 w-4" />
                    <span className="font-medium text-white/90">To Reward Every Effort</span>
                  </Button>
                </motion.div>

                <h1 className="mb-4 text-4xl font-bold md:text-6xl">
                  <span className="bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800 bg-clip-text text-transparent">
                    Collaborate
                  </span>{' '}
                  Smarter, Not Harder
                </h1>
                <p className="mb-6 text-xl text-muted-foreground md:text-2xl">
                  Evaluating and Rewarding Every Contribution in Next-Gen Decentralized Collaboration
                </p>
                <p className="mb-8 text-lg text-muted-foreground md:text-xl">
                  A cutting-edge platform for automated and fair reward distribution to open source developers based on
                  their contributions.
                </p>
                <div className="space-x-4">
                  <RainbowButton>Go to app</RainbowButton>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-24">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {features.map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="h-full"
                  >
                    <ShineBorder
                      className="relative flex h-full flex-col overflow-hidden rounded-lg border bg-background p-8"
                      color={['#A07CFE', '#FE8FB5', '#FFBE7B']}
                    >
                      <div className="relative z-10 flex h-full flex-col">
                        <div className="mb-4 inline-block w-5 rounded-xl bg-white/10 p-3">
                          <feature.icon />
                        </div>
                        <h3 className="mb-3 bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-xl font-semibold text-transparent">
                          {feature.title}
                        </h3>
                        <p className="text-gray-400 transition-colors group-hover:text-gray-300">
                          {feature.description}
                        </p>
                      </div>
                      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-color-1/30 to-color-3/30 blur-3xl transition-all duration-300 group-hover:from-color-1/40 group-hover:to-color-3/40" />
                    </ShineBorder>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Partners Section */}
          <section className="py-24">
            <div className="container mx-auto px-4">
              <h2 className="mb-16 bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-center text-3xl font-bold text-transparent">
                Our Valued Partners
              </h2>
              <div className="grid grid-cols-2 items-center gap-12 md:grid-cols-4">
                {partners.map((partner, index) => (
                  <motion.div
                    key={partner.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group flex items-center justify-center"
                  >
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="h-12 w-32 opacity-50 brightness-0 invert filter transition-all duration-300 group-hover:opacity-100"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Social Links */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="flex flex-col items-center justify-center space-y-8">
                <h2 className="text-center text-2xl font-bold">Connect With Us</h2>
                <div className="flex items-center space-x-6">
                  {socialLinks.map((link) => {
                    const Icon = link.icon
                    return (
                      <motion.a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-white/5 p-3 transition-colors hover:bg-white/10"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Icon className="h-6 w-6" />
                      </motion.a>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}

export default LandingPage
