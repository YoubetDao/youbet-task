import { motion } from 'framer-motion'
import useEmblaCarousel from 'embla-carousel-react'
import { useEffect } from 'react'

// 导入图片
import animocaLogo from '@/assets/logos/animoca.png'
import openCampusLogo from '@/assets/logos/openCampus.png'
import openbuildLogo from '@/assets/logos/openbuild.svg?url'
import socialLayerLogo from '@/assets/logos/social_layer.svg?url'
import virtualsLogo from '@/assets/logos/virtuals.svg?url'
import bewaterLogo from '@/assets/logos/bewater.jpeg'
import cosetLogo from '@/assets/logos/coset.svg?url'

const partners = [
  {
    name: 'Animoca',
    logo: animocaLogo,
  },
  {
    name: 'Coset',
    logo: cosetLogo,
  },
  {
    name: 'OpenCampus',
    logo: openCampusLogo,
  },
  {
    name: 'Openbuild',
    logo: openbuildLogo,
  },
  {
    name: 'Social Layer',
    logo: socialLayerLogo,
  },
  // {
  //   name: 'Superfluid',
  //   logo: superfluidLogo,
  // },
  {
    name: 'Virtuals',
    logo: virtualsLogo,
  },
  {
    name: 'bewater',
    logo: bewaterLogo,
  },
]

export const PartnersSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    dragFree: true,
    skipSnaps: false,
  })

  useEffect(() => {
    let autoplay: NodeJS.Timeout
    if (emblaApi) {
      const startAutoplay = () => {
        autoplay = setInterval(() => {
          emblaApi.scrollNext()
        }, 2000) // 每2秒滚动一次
      }

      const stopAutoplay = () => {
        clearInterval(autoplay)
      }

      // 开始自动播放
      startAutoplay()

      // 当用户手动操作时暂停自动播放
      emblaApi.on('pointerDown', stopAutoplay)
      emblaApi.on('pointerUp', startAutoplay)
    }

    return () => clearInterval(autoplay)
  }, [emblaApi])
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-8  text-2xl font-bold text-transparent text-white md:text-4xl">Our valued partners</h2>
          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            We&apos;re proud to work with industry leaders to deliver the best experience.
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto"
        >
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {partners.map((partner, index) => (
                <div key={index} className="w-[150px] flex-shrink-0 pl-4 md:w-[200px] md:pl-6">
                  <div className="flex h-[80px] items-center justify-center p-4">
                    <img
                      src={partner.logo}
                      alt={`${partner.name} logo`}
                      className="h-[30px] w-auto max-w-[100px] object-contain"
                    />
                  </div>
                </div>
              ))}
              {/* 复制一遍内容以确保无缝循环 */}
              {partners.map((partner, index) => (
                <div key={`duplicate-${index}`} className="w-[150px] flex-shrink-0 pl-4 md:w-[200px] md:pl-6">
                  <div className="flex h-[80px] items-center justify-center p-4">
                    <img
                      src={partner.logo}
                      alt={`${partner.name} logo`}
                      className="h-[30px] w-auto max-w-[100px] object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
