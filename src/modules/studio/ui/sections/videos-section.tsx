'use client'

import { InfiniteScroll } from '@/components/infinite-scroll'
import { DEFAULT_LIMIT } from '@/constants'
import { trpc } from '@/trpc/client'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

// import { useRouter } from 'next/navigation'
import { VideoThumbnail } from '@/modules/videos/ui/components/video-thumbnail'
import { snakeCaseToTitle } from '@/lib/utils'
import { Globe2Icon, LockIcon } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

import { useRouter } from 'next/navigation'

export const VideosSection = () => {
  return (
    <Suspense fallback={<VideoSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <VideosSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  )
}

const VideoSectionSkeleton = () => {
  return (
    <>
      <div className='border-y'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[510px] pl-6'>Video</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className='text-right'>Views</TableHead>
              <TableHead className='text-right'>Comments</TableHead>
              <TableHead className='pr-6 text-right'>Likes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell className='pl-6'>
                  <div className='flex items-center gap-4'>
                    <Skeleton className='h-20 w-36' />
                    <div className='flex flex-col gap-2'>
                      <Skeleton className='h-4 w-[100px]' />
                      <Skeleton className='w-[150px ] h-3' />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-20' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-16' />
                </TableCell>
                <TableCell className='text-right'>
                  <Skeleton className='ml-auto h-4 w-12' />
                </TableCell>
                <TableCell className='text-right'>
                  <Skeleton className='h-4 w-20' />
                </TableCell>
                <TableCell className='pr-6 text-right'>
                  <Skeleton className='h-4 w-20' />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

const VideosSectionSuspense = () => {
  const router = useRouter()
  const [videos, query] = trpc.studio.getMany.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT
    },
    {
      getNextPageParam: lastPage => lastPage.nextCursor
    }
  )
  return (
    <div>
      <div className='border-y'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[510px] pl-6'>Video</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className='text-right'>Views</TableHead>
              <TableHead className='text-right'>Comments</TableHead>
              <TableHead className='pr-6 text-right'>Likes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.pages
              .flatMap(page => page.items)
              .map(video => (
                // <Link
                //   key={video.id}
                //   href={`/studio/videos/${video.id}`}
                //   className='contents'
                // >
                <TableRow
                  onClick={() => router.push(`/studio/videos/${video.id}`)}
                  key={video.id}
                  className='cursor-pointer'
                >
                  <TableCell>
                    <div className='flex items-center gap-4 pl-6'>
                      <div className='relative aspect-video w-36 shrink-0'>
                        <VideoThumbnail
                          imageUrl={video.thumbnailUrl}
                          previewUrl={video.previewUrl}
                          title={video.title}
                          duration={video.duration}
                        />
                      </div>
                      <div className='flex flex-col gap-y-1 overflow-hidden'>
                        <span className='line-clamp-1 text-sm'>
                          {video.title}
                        </span>
                        <span className='text-muted-foreground line-clamp-1 text-xs'>
                          {video.description || 'No description'}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center'>
                      {video.visibility === 'private' ? (
                        <LockIcon className='mr-2 size-4' />
                      ) : (
                        <Globe2Icon className='mr-2 size-4' />
                      )}
                      {snakeCaseToTitle(video.visibility)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center'>
                      {snakeCaseToTitle(video.muxStatus || 'Error')}
                    </div>
                  </TableCell>
                  <TableCell className='truncate text-sm'>
                    {format(new Date(video.createdAt), 'd MMM yyyy')}
                  </TableCell>
                  <TableCell className='text-right text-sm'>views</TableCell>
                  <TableCell className='text-right text-sm'>comments</TableCell>
                  <TableCell className='pr-6 text-right text-sm'>
                    likes
                  </TableCell>
                </TableRow>
                // </Link>
              ))}
          </TableBody>
        </Table>
      </div>
      <InfiniteScroll
        isManual
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fectchNextPage={query.fetchNextPage}
      />
    </div>
  )
}
