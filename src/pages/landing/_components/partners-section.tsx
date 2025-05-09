import { motion } from 'framer-motion'
import useEmblaCarousel from 'embla-carousel-react'
import { useEffect } from 'react'

// 导入图片
import animocaLogo from '@/assets/logos/animoca.png'
import openCampusLogo from '@/assets/logos/openCampus.png'
import openbuildLogo from '@/assets/logos/openbuild.svg?url'
import socialLayerLogo from '@/assets/logos/social_layer.svg?url'
import superfluidLogo from '@/assets/logos/superfluid.jpeg'
import virtualsLogo from '@/assets/logos/virtuals.svg?url'
import bewaterLogo from '@/assets/logos/bewater.jpeg'
import antalphaLogo from '@/assets/logos/antalpha.jpg'

const partners = [
  {
    name: 'Animoca',
    logo: animocaLogo,
  },
  // {
  //   name: 'Coset',
  //   logo: '/src/assets/logos/coset.svg',
  // },
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
  {
    name: 'Superfluid',
    logo: superfluidLogo,
  },
  {
    name: 'Virtuals',
    logo: virtualsLogo,
  },
  {
    name: 'bewater',
    logo: bewaterLogo,
  },
  {
    name: 'antalpha',
    logo: antalphaLogo,
  },
]

export const PartnersSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    dragFree: true,
  })

  useEffect(() => {
    let autoplay: NodeJS.Timeout
    if (emblaApi) {
      autoplay = setInterval(() => {
        emblaApi.scrollNext()
      }, 3000) // Scroll every 3 seconds
    }
    return () => clearInterval(autoplay)
  }, [emblaApi])
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        {/* <h2 className="mb-16 bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-center text-3xl font-bold text-transparent">
                Our Valued Partners
              </h2> */}
        <div className="mb-16 text-center">
          <h2 className="mb-8 bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800 bg-clip-text text-2xl font-bold text-transparent md:text-4xl">
            Our valued partners
          </h2>
          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            We&apos;re proud to work with industry leaders to deliver the best experience.
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto max-w-5xl"
        >
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {partners.map((partner, index) => (
                <div key={index} className="min-w-0 flex-[0_0_33.33%] pl-4 md:pl-6">
                  <div className="p-4">
                    <div className="flex h-32 items-center justify-center rounded-lg border border-purple-500/20 bg-background p-6 transition-all duration-300 hover:border-purple-500/40">
                      <img src={partner.logo} alt={`${partner.name} logo`} className="max-h-16 max-w-full" />
                    </div>
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
