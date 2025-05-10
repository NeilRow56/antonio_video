export const dynamic = 'force-dynamic'

interface VideoPageProps {
  params: Promise<{ videoId: string }>
}

const IndividualVideoPage = async ({ params }: VideoPageProps) => {
  return <div>Video view</div>
}

export default IndividualVideoPage
