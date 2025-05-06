'use client'

import { ResponsiveModal } from '@/components/responsive-dialog'
import { Button } from '@/components/ui/button'
import { trpc } from '@/trpc/client'
import { Loader2Icon, PlusIcon } from 'lucide-react'
import { toast } from 'sonner'

export const StudioUploadModal = () => {
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
  return (
    <>
      <ResponsiveModal
        title='Upload a video'
        // !! coercion to a boolean value. Means that you want to make sure your resulting value is either true or false, not undefined or [ ].
        open={!!create.data}
        onOpenChange={() => create.reset()}
      >
        <p>This will be an uploader</p>
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
