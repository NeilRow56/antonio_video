import { VideosSection } from '../sections/videos-section'

interface StudioViewProps {
  categoryId?: string
}

export const StudioView = ({}: StudioViewProps) => {
  return (
    <div className='flex flex-col gap-y-6 px-4 pt-2.5'>
      <div className='px-4'>
        <h1 className='text-2xl font-bold'>Channel content</h1>
        <p className='text-muted-foreground text-xs'>
          Manage your channel content and videos
        </p>
      </div>
      <VideosSection />
    </div>
  )
}
