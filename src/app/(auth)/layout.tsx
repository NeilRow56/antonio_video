interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className='flex min-h-screen items-center justify-center bg-gray-200'>
      {children}
    </main>
  )
}
