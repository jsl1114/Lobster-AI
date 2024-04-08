import {
  MessageSquareCodeIcon,
  ImagesIcon,
  MessageSquare,
  Music,
  VideoIcon,
} from 'lucide-react'

// free trial counts
export const MAX_FREE_COUNTS = 30

export const tools =
  process.env.NEXT_PUBLIC_NODE_ENV === 'production'
    ? [
        {
          label: 'Conversation',
          icon: MessageSquare,
          href: '/conversation',
          color: 'text-violet-500',
          bgColor: 'bg-violet-500/10',
        },
        {
          label: 'Image Generation',
          icon: ImagesIcon,
          href: '/image',
          color: 'text-pink-700',
          bgColor: 'bg-pink-700/10',
        },
        {
          label: 'Code Generation',
          icon: MessageSquareCodeIcon,
          href: '/code',
          color: 'text-red-500',
          bgColor: 'bg-red-500/10',
        },
      ]
    : [
        {
          label: 'Conversation',
          icon: MessageSquare,
          href: '/conversation',
          color: 'text-violet-500',
          bgColor: 'bg-violet-500/10',
        },
        {
          label: 'Music Generation',
          icon: Music,
          href: '/music',
          color: 'text-emerald-400',
          bgColor: 'bg-emerald-400/10',
        },
        {
          label: 'Image Generation',
          icon: ImagesIcon,
          href: '/image',
          color: 'text-pink-700',
          bgColor: 'bg-pink-700/10',
        },
        {
          label: 'Video Generation',
          icon: VideoIcon,
          href: '/video',
          color: 'text-orange-500',
          bgColor: 'bg-orange-500/10',
        },
        {
          label: 'Code Generation',
          icon: MessageSquareCodeIcon,
          href: '/code',
          color: 'text-red-500',
          bgColor: 'bg-red-500/10',
        },
      ]
