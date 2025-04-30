interface PageProps {
  params: Promise<{ videoId: string }>
}

const VidoIdPage = async ({ params }: PageProps) => {
  const { videoId } = await params
  return <div>VideoId: {videoId}</div>
}

export default VidoIdPage
