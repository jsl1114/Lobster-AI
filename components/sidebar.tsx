'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Montserrat } from 'next/font/google'
import { cn } from '@/lib/utils'
import {
  ImagesIcon,
  LayoutDashboard,
  MessageSquare,
  MessageSquareCodeIcon,
  Music,
  Settings,
  VideoIcon,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import { FreeCounter } from './free-counter'

const montserrat = Montserrat({ weight: '600', subsets: ['latin'] })

const routes =
  process.env.NEXT_PUBLIC_NODE_ENV === 'production'
    ? [
        {
          label: 'Dashboard',
          icon: LayoutDashboard,
          href: '/dashboard',
          color: 'text-sky-500',
        },
        {
          label: 'Conversation',
          icon: MessageSquare,
          href: '/conversation',
          color: 'text-violet-500',
        },
        {
          label: 'Image Generation',
          icon: ImagesIcon,
          href: '/image',
          color: 'text-pink-700',
        },
        {
          label: 'Code Generation',
          icon: MessageSquareCodeIcon,
          href: '/code',
          color: 'text-red-500',
        },
        {
          label: 'Settings',
          icon: Settings,
          href: '/settings',
          color: 'text-gray-400',
        },
      ]
    : [
        {
          label: 'Dashboard',
          icon: LayoutDashboard,
          href: '/dashboard',
          color: 'text-sky-500',
        },
        {
          label: 'Conversation',
          icon: MessageSquare,
          href: '/conversation',
          color: 'text-violet-500',
        },
        {
          label: 'Image Generation',
          icon: ImagesIcon,
          href: '/image',
          color: 'text-pink-700',
        },
        {
          label: 'Video Generation',
          icon: VideoIcon,
          href: '/video',
          color: 'text-orange-700',
        },
        {
          label: 'Music Generation',
          icon: Music,
          href: '/music',
          color: 'text-emerald-400',
        },
        {
          label: 'Code Generation',
          icon: MessageSquareCodeIcon,
          href: '/code',
          color: 'text-red-500',
        },
        {
          label: 'Settings',
          icon: Settings,
          href: '/settings',
          color: 'text-gray-400',
        },
      ]

interface SidebarProps {
  apiLimitCount: number
  isPro: boolean
}

const Sidebar = ({ apiLimitCount = 0, isPro = false }: SidebarProps) => {
  const pathname = usePathname()
  return (
    <div className='space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white'>
      <div className='px-2 py-2 flex-1'>
        <Link
          href='/'
          className='flex items-center pl-3 mb-4'
        >
          <div className='relative w-8 h-8 mr-4'>
            <Image
              fill
              alt='logo'
              src='/logo.png'
            />
          </div>
          <h1
            className={cn('text-3xl font-bold font-mono', montserrat.className)}
          >
            Lobster
          </h1>
        </Link>
        <div className='space-y-1'>
          {routes.map((r) => (
            <Link
              href={r.href}
              key={r.href}
              className={cn(
                'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-xl transition',
                pathname === r.href ? 'text-white bg-white/10' : 'text-inc-400'
              )}
            >
              <div className='flex items-center flex-1'>
                <r.icon className={cn('h-5 w-5 mr-3', r.color)} />
                {r.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <FreeCounter
        isPro={isPro}
        apiLimitCount={apiLimitCount}
      />
    </div>
  )
}
export default Sidebar
