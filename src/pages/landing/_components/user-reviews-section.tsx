import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import review1 from '@/assets/user-reviews/review1.png'
import review2 from '@/assets/user-reviews/review2.png'
import review3 from '@/assets/user-reviews/review3.png'
import review4 from '@/assets/user-reviews/review4.png'
import ShapoWidget from '@/components/ShapoWidget'

const reviews = [
  {
    id: 1,
    image: review1,
    alt: 'User Review 1',
    tweetId: '1928447674208104862',
  },
  {
    id: 2,
    image: review2,
    alt: 'User Review 2',
    tweetId: '1927384098118533604',
  },
  {
    id: 3,
    image: review3,
    alt: 'User Review 3',
    tweetId: '1927400129415266653',
  },
  {
    id: 4,
    image: review4,
    alt: 'User Review 4',
    tweetId: '1927393499369922986',
  },
]

export const UserReviewsSection = () => {
  return (
    <section id="user-reviews" className="relative py-24">
      <div className="container mx-auto px-4">
        <div className=" text-center">
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
        </div>

        {/* <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="cursor-pointer">
                <img
                  src={review.image}
                  alt={review.alt}
                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </motion.div>
          ))}
        </div> */}
        <ShapoWidget widgetId="18c1ae929eb2ef30f76f" />

        {/* 装饰性元素 */}
        <div className="absolute -left-20 top-1/4 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute -right-20 bottom-1/4 h-40 w-40 rounded-full bg-pink-500/10 blur-3xl" />
      </div>
    </section>
  )
}
