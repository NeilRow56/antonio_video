'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'

import Link from 'next/link'
import { LogOutIcon, VideoIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { StudioSidebarHeader } from './studio-sidebar-header'

export const StudioSidebar = () => {
  const pathname = usePathname()
  return (
    <Sidebar className='z-40 pt-16' collapsible='icon'>
      <SidebarContent className='bg-background'>
        <SidebarGroup>
          <SidebarMenu>
            <StudioSidebarHeader />
            <SidebarMenuItem>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton asChild isActive={pathname === '/studio'}>
                    <Link href='/studio'>
                      <VideoIcon className='size-5' />
                      <span className='text-sm'>Content</span>
                    </Link>
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent>Studio video content</TooltipContent>
              </Tooltip>
            </SidebarMenuItem>
            <Separator />
            <SidebarMenuItem>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton asChild>
                    <Link href='/'>
                      <LogOutIcon className='size-5' />
                      <span className='text-sm'>Exit studio</span>
                    </Link>
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent>Exit studio</TooltipContent>
              </Tooltip>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
