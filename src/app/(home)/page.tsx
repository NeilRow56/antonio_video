'use client'

import { trpc } from '@/trpc/client'

export default function Home() {
  const { data } = trpc.hello.useQuery({ text: 'Hello Antonio' })
  return <div className=''>Client component says: {data?.greeting}</div>
}
