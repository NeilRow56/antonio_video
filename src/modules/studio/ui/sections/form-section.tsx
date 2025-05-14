'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { trpc } from '@/trpc/client'
import {
  CopyCheckIcon,
  CopyIcon,
  Globe2Icon,
  ImagePlusIcon,
  LockIcon,
  MoreVerticalIcon,
  RotateCcwIcon,
  SparklesIcon,
  TrashIcon
} from 'lucide-react'
import { Suspense, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { videoUpdateSchema } from '@/db/schema'
import { toast } from 'sonner'
import { VideoPlayer } from '@/modules/videos/ui/components/video-player'
import Link from 'next/link'
import { snakeCaseToTitle } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { THUMBNAIL_FALLBACK } from '@/modules/videos/constants'
import { ThumbnailUploadModal } from '../components/thumbnail-upload-modal'

interface FormSectionProps {
  videoId: string
}

export const FormSection = ({ videoId }: FormSectionProps) => {
  return (
    <Suspense fallback={<FormSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <FormSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  )
}

// We are getting a video from the database where the id equals the params videoId

const FormSectionSuspense = ({ videoId }: FormSectionProps) => {
  const router = useRouter()
  const utils = trpc.useUtils()

  const [thumbnailModalOpen, setThumbnailModalOpem] = useState(false)
  const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId })
  const [categories] = trpc.categories.getMany.useSuspenseQuery()

  const update = trpc.videos.update.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate()
      utils.studio.getOne.invalidate({ id: videoId })
      toast.success('Video updated')
    },
    onError: () => {
      toast.error('Something went wrong')
    }
  })

  const remove = trpc.videos.remove.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate()
      toast.success('Video removed')
      router.push('/studio')
    },
    onError: () => {
      toast.error('Something went wrong')
    }
  })

  // 1. Define your form.
  const form = useForm<z.infer<typeof videoUpdateSchema>>({
    resolver: zodResolver(videoUpdateSchema),
    defaultValues: video
  })

  const onSubmit = (data: z.infer<typeof videoUpdateSchema>) => {
    update.mutate(data)
  }

  // TODO: Change if deploying outside of VERCEL
  const fullUrl = `${process.env.VERCEL_URL || 'http://localhost:3000}'}/videos/${video.id}`

  const [isCopied, setIsCopied] = useState(false)

  const onCopy = async () => {
    await navigator.clipboard.writeText(fullUrl)

    setIsCopied(true)

    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  return (
    <>
      <ThumbnailUploadModal
        open={thumbnailModalOpen}
        onOpenChange={setThumbnailModalOpem}
        videoId={videoId}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='mb-6 flex items-center justify-between'>
            <div>
              <h1 className='text-2xl font-bold'>Video details</h1>
              <p className='text-muted-foreground text-xs'>
                Manage your video details
              </p>
            </div>
            <div className='flex items-center gap-x-2'>
              <Button type='submit' disabled={update.isPending}>
                Save
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='icon'>
                    <MoreVerticalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem
                    onClick={() => remove.mutate({ id: videoId })}
                  >
                    <TrashIcon className='mr-2 size-4' />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-5'>
            <div className='space-y-8 lg:col-span-3'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Title
                      {/*TODO: Add AI generate button  */}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Add a title to your video'
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Description
                      {/*TODO: Add AI generate button  */}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value ?? ''}
                        placeholder='Add a description to your video'
                        className='resize-none pr-10'
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Add thumbnail here - using uploadthing*/}
              <FormField
                control={form.control}
                name='thumbnailUrl'
                render={() => (
                  <FormItem>
                    <FormLabel>Thumbnail</FormLabel>
                    <FormControl>
                      <div className='group relative h-[84px] w-[153px] border border-dashed border-neutral-400 p-0.5'>
                        <Image
                          fill
                          alt='thumbnail'
                          src={video.thumbnailUrl || THUMBNAIL_FALLBACK}
                          className='object-cover'
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type='button'
                              size='icon'
                              className='absolute top-1 right-1 size-7 rounded-full bg-black/50 opacity-100 duration-300 group-hover:opacity-100 hover:bg-black/50 md:opacity-0'
                            >
                              <MoreVerticalIcon className='text-white' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='start' side='right'>
                            <DropdownMenuItem
                              onClick={() => setThumbnailModalOpem(true)}
                            >
                              <ImagePlusIcon className='mr-1 size-4' />
                              Change
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <SparklesIcon className='mr-1 size-4' />
                              AI-generated
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <RotateCcwIcon className='mr-1 size-4' />
                              Restore
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className='w-full'>
                <FormField
                  control={form.control}
                  name='categoryId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Category
                        {/*TODO: Add AI generate button  */}
                      </FormLabel>

                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value ?? undefined}
                      >
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select a category' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className='flex flex-col gap-y-8 lg:col-span-2'>
              <div className='flex h-fit flex-col gap-4 overflow-hidden rounded-xl bg-[#F9F9F9]'>
                <div className='relative aspect-video overflow-hidden'>
                  <VideoPlayer
                    playbackId={video.muxPlaybackId}
                    thumbnailUrl={video.thumbnailUrl}
                  />
                </div>
                <div className='flex flex-col gap-y-6 p-4'>
                  <div className='flex items-center justify-between gap-x-2'>
                    <div className='flex flex-col gap-y-1'>
                      <p className='text-muted-foreground text-xs'>
                        Video link
                      </p>
                      <div className='items-center gap-x-2'>
                        <Link href={`/videos/${video.id}`}>
                          <p className='line-clamp-1 text-sm text-blue-500'>
                            {fullUrl}
                          </p>
                        </Link>
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          className='shrink-0'
                          onClick={onCopy}
                          disabled={isCopied}
                        >
                          {isCopied ? <CopyCheckIcon /> : <CopyIcon />}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center justify-between'>
                    <div className='flex flex-col gap-y-1'>
                      <p className='text-muted-foreground text-xs'>
                        Video status
                      </p>
                      <p className='text-sm'>
                        {snakeCaseToTitle(video.muxStatus || 'preparing')}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center justify-between'>
                    <div className='flex flex-col gap-y-1'>
                      <p className='text-muted-foreground text-xs'>
                        Subtitles status
                      </p>
                      <p className='text-sm'>
                        {snakeCaseToTitle(
                          video.muxTrackStatus || 'no_subtitles'
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='w-full'>
                <FormField
                  control={form.control}
                  name='visibility'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Visibility
                        {/*TODO: Add AI generate button  */}
                      </FormLabel>

                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value ?? undefined}
                      >
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select visibility' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='public'>
                            <div className='flex items-center'>
                              <Globe2Icon className='mr-2 size-4' />
                              Public
                            </div>
                          </SelectItem>
                          <SelectItem value='private'>
                            <div className='flex items-center'>
                              <LockIcon className='mr-2 size-4' />
                              Private
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </form>
      </Form>
    </>
  )
}

const FormSectionSkeleton = () => {
  return <p>Loading...</p>
}
