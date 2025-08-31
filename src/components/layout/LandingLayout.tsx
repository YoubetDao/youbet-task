import { PropsWithChildren, useState } from 'react'
import { Github, Heart, Twitter } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { InteractiveHoverButton } from '../ui/interactive-hover-button'

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
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <div className="fixed left-0 right-0 top-0 z-50 border-b border-[#222222] bg-black/80 px-4 py-2.5 backdrop-blur-sm md:px-10">
        <div className="relative mx-auto flex h-10 max-w-[1200px] items-center justify-between text-white">
          <div className="flex items-center gap-1 text-xl font-bold">
            <img src="/logo.svg" alt="According.Work" width={28} height={28} />
            According.Work
          </div>

          {/* 桌面端导航 */}
          <div className="hidden items-center gap-8 md:flex">
            <div className="flex items-center gap-8">
              {navAnchorLinks.map((nav) => (
                <div
                  key={nav.name}
                  onClick={() => {
                    scrollToAnchor(nav.href)
                  }}
                  className="cursor-pointer text-base text-white hover:underline"
                >
                  {nav.name}
                </div>
              ))}
            </div>
            <InteractiveHoverButton
              onClick={() => {
                navigate('/dashboard')
              }}
            >
              Go to app
            </InteractiveHoverButton>
          </div>

          {/* 移动端汉堡菜单按钮 */}
          <button
            className="flex h-6 w-6 cursor-pointer flex-col items-center justify-center md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span
              className={`block h-0.5 w-6 rounded-sm bg-white transition-all duration-300 ease-out ${
                isMenuOpen ? 'translate-y-1 rotate-45' : '-translate-y-0.5'
              }`}
            ></span>
            <span
              className={`my-0.5 block h-0.5 w-6 rounded-sm bg-white transition-all duration-300 ease-out ${
                isMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            ></span>
            <span
              className={`block h-0.5 w-6 rounded-sm bg-white transition-all duration-300 ease-out ${
                isMenuOpen ? '-translate-y-1 -rotate-45' : 'translate-y-0.5'
              }`}
            ></span>
          </button>
        </div>

        {/* 移动端导航菜单 */}
        <div
          className={`absolute left-0 right-0 top-full border-b border-[#222222] bg-black/95 backdrop-blur-sm transition-all duration-300 ease-in-out md:hidden ${
            isMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'
          }`}
        >
          <div className="mx-auto max-w-[1200px] space-y-4 p-2">
            {navAnchorLinks.map((nav) => (
              <div
                key={nav.name}
                onClick={() => {
                  scrollToAnchor(nav.href)
                  setIsMenuOpen(false)
                }}
                className="block cursor-pointer py-2 text-base font-medium text-white hover:text-gray-300"
              >
                {nav.name}
              </div>
            ))}
            <div className="pt-2">
              <InteractiveHoverButton
                onClick={() => {
                  navigate('/dashboard')
                }}
              >
                Go to app
              </InteractiveHoverButton>
            </div>
          </div>
        </div>
      </div>

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
                We’re building a decentralized platform that enables developers to collaborate trustless, contribute
                meaningfully, and earn fairly — powered by open coordination.
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
                    <button
                      onClick={() => scrollToAnchor(link.href)}
                      className="text-sm text-gray-400 transition-colors duration-200 hover:text-white"
                    >
                      {link.name}
                    </button>
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
