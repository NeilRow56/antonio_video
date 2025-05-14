import { formatDuration } from '@/lib/utils'
import Image from 'next/image'
import { THUMBNAIL_FALLBACK } from '../../constants'

interface VideoThumbnailProps {
  title: string
  duration: number
  imageUrl?: string | null
  previewUrl?: string | null
}

export const VideoThumbnail = ({
  title,
  duration,
  imageUrl,
  previewUrl
}: VideoThumbnailProps) => {
  return (
    <div className='group relative'>
      {/* Thumbnail wrapper */}
      <div className='relative aspect-video w-full overflow-hidden rounded-xl'>
        <Image
          src={imageUrl || THUMBNAIL_FALLBACK}
          alt={title}
          fill
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          className='size-full w-full object-cover group-hover:opacity-0'
        />
        <Image
          unoptimized={!!previewUrl}
          src={previewUrl || THUMBNAIL_FALLBACK}
          alt={title}
          fill
          sizes='(max-width: 320px) 280px, (max-width: 480px) 440px, 800px'
          className='size-full w-full object-cover opacity-0 group-hover:opacity-100'
        />
      </div>
      {/* Video duration box */}
      <div className='py0.5 bg-blac/80 absolute right-2 bottom-2 rounded px-1 text-xs font-medium text-white'>
        {formatDuration(duration)}
      </div>
    </div>
  )
}
