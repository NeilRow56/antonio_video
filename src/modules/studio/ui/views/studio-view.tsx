import { VideosSection } from '../sections/videos-section'

interface StudioViewProps {
  categoryId?: string
}

export const StudioView = ({}: StudioViewProps) => {
  return (
    <div className='mx-auto mb-10 flex max-w-[2400px] flex-col gap-y-6 px-4 pt-2.5'>
      <VideosSection />
    </div>
  )
}
