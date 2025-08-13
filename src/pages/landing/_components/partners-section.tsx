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
    <section id="partners" className="py-24">
      <div className="container mx-auto px-4">
        <div className=" text-center">
          <p className="mb-3 text-xs text-muted-foreground text-white sm:text-sm md:mb-6 md:text-base">
            Trusted by Leading Crypto Partners
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
                <div key={index} className="w-[120px] flex-shrink-0 pl-4 md:w-[150px] md:pl-6 lg:w-[200px]">
                  <div className="flex h-[80px] items-center justify-center p-4">
                    <img
                      src={partner.logo}
                      alt={`${partner.name} logo`}
                      className="h-[24px] w-auto max-w-[80px] object-contain md:h-[30px] md:max-w-[100px] lg:h-[40px]"
                    />
                  </div>
                </div>
              ))}
              {/* 复制一遍内容以确保无缝循环 */}
              {partners.map((partner, index) => (
                <div
                  key={`duplicate-${index}`}
                  className="w-[120px] flex-shrink-0 pl-4 md:w-[150px] md:pl-6 lg:w-[200px]"
                >
                  <div className="flex h-[80px] items-center justify-center p-4">
                    <img
                      src={partner.logo}
                      alt={`${partner.name} logo`}
                      className="h-[24px] w-auto max-w-[80px] object-contain md:h-[30px] md:max-w-[100px] lg:h-[40px]"
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
