'use client'

import { ResponsiveModal } from '@/components/responsive-dialog'
import { Button } from '@/components/ui/button'
import { trpc } from '@/trpc/client'
import { Loader2Icon, PlusIcon } from 'lucide-react'
import { toast } from 'sonner'
import { StudioUploader } from './studio-uploader'
import { useRouter } from 'next/navigation'

export const StudioUploadModal = () => {
  const router = useRouter()
  const utils = trpc.useUtils()
  const create = trpc.videos.create.useMutation({
    onSuccess: () => {
      toast.success('Video created')
      utils.studio.getMany.invalidate()
    },
    onError: () => {
      toast.error('Something went wrong!')
    }
  })

  const onSuccess = () => {
    if (!create.data?.video.id) return

    create.reset()
    router.push(`/studio/videos/${create.data.video.id}`)
  }
  return (
    <>
      <ResponsiveModal
        title='Upload a video'
        // !! coercion to a boolean value. Means that you want to make sure your resulting value is either true or false, not undefined or [ ].
        open={!!create.data?.url}
        onOpenChange={() => create.reset()}
      >
        {create.data?.url ? (
          <StudioUploader endpoint={create.data.url} onSuccess={onSuccess} />
        ) : (
          <Loader2Icon className='animate-spin' />
        )}
      </ResponsiveModal>
      <Button
        className='cursor-pointer'
        disabled={create.isPending}
        variant='secondary'
        onClick={() => create.mutate()}
      >
        {create.isPending ? (
          <Loader2Icon className='animate-spin' />
        ) : (
          <PlusIcon size='8' />
        )}
        Create
      </Button>
    </>
  )
}
