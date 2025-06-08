import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import review1 from '@/assets/user-reviews/review1.jpg'
import review2 from '@/assets/user-reviews/review2.jpg'
import review3 from '@/assets/user-reviews/review3.jpg'
import review4 from '@/assets/user-reviews/review4.jpg'

const reviews = [
  {
    id: 1,
    image: review1,
    alt: 'User Review 1',
  },
  {
    id: 2,
    image: review2,
    alt: 'User Review 2',
  },
  {
    id: 3,
    image: review3,
    alt: 'User Review 3',
  },
  {
    id: 4,
    image: review4,
    alt: 'User Review 4',
  },
]

export const UserReviewsSection = () => {
  return (
    <section id="user-reviews" className="relative py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-4 flex items-center justify-center gap-2"
          >
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
            ))}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="mb-4 text-3xl font-bold text-white md:text-4xl"
          >
            What Our Users Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-lg text-white"
          >
            Discover how According.Work connects developers with meaningful opportunities and fair rewards for their
            contributions
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-white/20 hover:bg-white/10">
                <div className="flex h-80 items-center justify-center overflow-hidden rounded-lg bg-gray-900/20">
                  <img
                    src={review.image}
                    alt={review.alt}
                    className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* 装饰性元素 */}
        <div className="absolute -left-20 top-1/4 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute -right-20 bottom-1/4 h-40 w-40 rounded-full bg-pink-500/10 blur-3xl" />
      </div>
    </section>
  )
}
