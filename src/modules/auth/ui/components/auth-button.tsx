'use client'

import { Button } from '@/components/ui/button'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { ClapperboardIcon, UserCircleIcon } from 'lucide-react'

export const AuthButton = () => {
  //TODO: add different auth states
  return (
    <>
      <SignedIn>
        <UserButton>
          <UserButton.MenuItems>
            <UserButton.Link
              href='/studio'
              label='Studio'
              labelIcon={<ClapperboardIcon className='size=4' />}
            />
          </UserButton.MenuItems>
        </UserButton>
        {/* TODO: Add  menu item for User profile*/}
      </SignedIn>
      <SignedOut>
        <SignInButton>
          <Button
            variant='outline'
            className='rounded-full border-blue-500/20 px-4 py-2 text-sm font-medium text-blue-600 shadow-none hover:text-blue-500 [&_svg]:size-4'
          >
            <UserCircleIcon />
            Sign in
          </Button>
        </SignInButton>
      </SignedOut>
    </>
  )
}
