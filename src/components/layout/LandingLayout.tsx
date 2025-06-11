import { PropsWithChildren } from 'react'
import { Github, Heart, Twitter } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { InteractiveHoverButton } from '../ui/interactive-hover-button'
import { getNavItems } from '@/constants/data'

const socialLinks = [
  {
    icon: <Twitter className="h-5 w-5" />,
    href: 'https://x.com/accordingwork',
    label: 'Twitter',
    color: 'hover:text-blue-400',
  },
  {
    icon: <Github className="h-5 w-5" />,
    href: 'https://github.com/YoubetDao',
    label: 'GitHub',
    color: 'hover:text-gray-300',
  },
]

// 导航锚点配置
const navAnchorLinks = [
  { name: 'Features', href: '#features' },
  { name: 'User Reviews', href: '#user-reviews' },
  { name: 'Partners', href: '#partners' },
]

// 平滑滚动到锚点的函数
const scrollToAnchor = (href: string) => {
  const element = document.querySelector(href)
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }
}

const LandingLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <header
        className="max-w-lg:mr-auto fixed top-4 z-20 flex h-[60px] w-full max-w-[100vw] justify-between rounded-md bg-white px-[3%] 
                    text-gray-700 shadow-md dark:bg-[#17181b] dark:text-gray-200 dark:shadow-gray-700 max-lg:top-0 lg:left-1/2 lg:max-w-5xl lg:-translate-x-1/2
                    lg:px-4 lg:opacity-[0.99] lg:!backdrop-blur-lg"
      >
        <div className="flex items-center space-x-6">
          <Link to="/" className="group flex items-center gap-2">
            <img src="/logo.svg" alt="According.Work" className="h-8" />
            <span className="font-outfit text-lg font-light tracking-wide">According.Work</span>
          </Link>
        </div>

        {/* 导航菜单 */}
        <nav className="hidden items-center space-x-6 md:flex">
          {navAnchorLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => scrollToAnchor(link.href)}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {link.name}
            </button>
          ))}
        </nav>

        <Link className="flex items-center" to={getNavItems().find((item) => item.title === 'Login')!.href}>
          <InteractiveHoverButton>Go to app</InteractiveHoverButton>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-16">{children}</main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/30 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Logo & Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="mb-4 flex items-center space-x-2 text-2xl font-bold">About Us</div>

              <p className="max-w-md leading-relaxed text-gray-400">
                We are a research-driven DAO focused on advancing foundational blockchain technologies, zero-knowledge
                cryptography (zk), and the intersection of AI and Web3. Our contributors come from diverse backgrounds
                and collaborate globally to build innovative, open-source solutions.
              </p>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="mb-4 text-lg font-semibold text-white">Quick Links</h3>
              <ul className="space-y-2">
                {navAnchorLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-400 transition-colors duration-200 hover:text-white"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact & Social */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="mb-4 text-lg font-semibold text-white">Contact Us</h3>
              <div className="space-y-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, x: 5 }}
                    className={`flex items-center space-x-3 text-gray-400 ${social.color} text-sm transition-all duration-200`}
                  >
                    {social.icon}
                    <span>{social.label}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Bottom Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="border-t border-white/10 pt-8"
          >
            <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>© 2025YouBetDao. All rights reserved.</span>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>Made with</span>
                <Heart className="h-4 w-4 animate-pulse text-red-500" />
                <span>for the Web3 community</span>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}

export default LandingLayout
