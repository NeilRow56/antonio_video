import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { useEffect } from 'react'
import { Button } from './ui/button'

interface InfiniteScrollProps {
  isManual?: boolean
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fectchNextPage: () => void
}

export const InfiniteScroll = ({
  isManual = false,
  hasNextPage,
  isFetchingNextPage,
  fectchNextPage
}: InfiniteScrollProps) => {
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.5,
    rootMargin: '100px'
  })

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage && !isManual) {
      fectchNextPage()
    }
  }, [
    fectchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isIntersecting,
    isManual
  ])

  return (
    <div className='flex flex-col items-center gap-4 p-4'>
      <div ref={targetRef} className='h-1' />
      {hasNextPage ? (
        <Button
          variant='secondary'
          disabled={!hasNextPage || isFetchingNextPage}
          onClick={() => fectchNextPage()}
        >
          {isFetchingNextPage ? 'Loading...' : 'Load more'}
        </Button>
      ) : (
        <p className='text-muted-foreground text-xs'>
          You have reached the end of the list.
        </p>
      )}
    </div>
  )
}
