import { cn } from '@/lib/utils'
import { ShineBorder } from '@/components/ui/shine-border'

interface TestimonialProps {
  content: string
  author: string
  position: string
  avatar?: string
}

export const UseCases = ({ content, author, position, avatar }: TestimonialProps) => {
  return (
    <ShineBorder className="h-full" color={['#A07CFE', '#FE8FB5', '#FFBE7B']} borderRadius={12} duration={10}>
      <div className="relative flex h-full flex-col overflow-hidden rounded-lg border bg-background p-8">
        <div className="relative z-10 flex h-full flex-col">
          <div className="mb-6 text-purple-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
            </svg>
          </div>
          <p className={cn('min-h-[120px] flex-grow text-gray-400 transition-colors group-hover:text-gray-300')}>
            {content}
          </p>
          <div className="mt-6 flex items-center">
            <div className="mr-4">
              <img
                src={avatar || 'https://placehold.co/100?text=User'}
                alt={author}
                className="h-12 w-12 rounded-full border-2 border-purple-400"
              />
            </div>
            <div>
              <p className="bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800 bg-clip-text font-semibold text-transparent">
                {author}
              </p>
              <p className="text-sm text-gray-500">{position}</p>
            </div>
          </div>
        </div>
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-purple-600/20 to-pink-400/20 blur-3xl transition-all duration-300 group-hover:from-purple-600/30 group-hover:to-pink-400/30" />
      </div>
    </ShineBorder>
  )
}
