import { HomeView } from '@/modules/categories/views/home-view'
import { HydrateClient, trpc } from '@/trpc/server'

export const dynamic = 'force-dynamic'

interface HomePageProps {
  searchParams: Promise<{
    categoryId?: string
  }>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { categoryId } = await searchParams
  void trpc.categories.getMany.prefetch()

  // Whereever we prefetch data Hydrate client
  return (
    <HydrateClient>
      <HomeView categoryId={categoryId} />
    </HydrateClient>
  )
}
