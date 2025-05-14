'use client'

import { ResponsiveModal } from '@/components/responsive-dialog'
import { trpc } from '@/trpc/client'
import { UploadButton } from '@/utils/uploadthing'

interface ThumbnailUploadModalProps {
  videoId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const ThumbnailUploadModal = ({
  videoId,
  open,
  onOpenChange
}: ThumbnailUploadModalProps) => {
  const utils = trpc.useUtils()

  const onUploadComplete = () => {
    utils.studio.getMany.invalidate()
    utils.studio.getOne.invalidate({ id: videoId })
    onOpenChange(false)
  }
  return (
    <ResponsiveModal
      title='Upload a thumbnail'
      open={open}
      onOpenChange={onOpenChange}
    >
      <UploadButton
        endpoint='thumbnailUploader'
        appearance={{
          button:
            'flex items-center gap-2 bg-blue-500  px-4 py-2 rounded  w-100 '
        }}
        input={{ videoId }}
        onClientUploadComplete={onUploadComplete}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`)
        }}
        className='text-white'
      />
    </ResponsiveModal>
  )
}
