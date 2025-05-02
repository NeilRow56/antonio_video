'use client'

import { trpc } from '@/trpc/client'

export const ClientPage = () => {
  const [data] = trpc.hello.useSuspenseQuery({
    text: 'Antonio'
  })
  return <div>Client page says: {data.greeting}</div>
}
