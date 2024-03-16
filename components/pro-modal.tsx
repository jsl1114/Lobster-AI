'use client'

import { useProModal } from '@/hooks/use-pro-modal'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Badge } from './ui/badge'

import {
  MessageSquareCodeIcon,
  ImagesIcon,
  MessageSquare,
  Music,
  VideoIcon,
  Check,
  Zap,
} from 'lucide-react'
import { Card } from './ui/card'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'

const tools = [
  {
    label: 'Conversation',
    icon: MessageSquare,
    color: 'text-violet-500',
    bgColor: 'bg-violet-500/10',
  },
  {
    label: 'Music Generation',
    icon: Music,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-400/10',
  },
  {
    label: 'Image Generation',
    icon: ImagesIcon,
    color: 'text-pink-700',
    bgColor: 'bg-pink-700/10',
  },
  {
    label: 'Video Generation',
    icon: VideoIcon,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  {
    label: 'Code Generation',
    icon: MessageSquareCodeIcon,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
]

export const ProModal = () => {
  const proModal = useProModal()

  return (
    <Dialog
      open={proModal.isOpen}
      onOpenChange={proModal.onClose}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='flex justify-center items-center flex-col gap-y-4 pb-2'>
            <div className='flex items-center gap-x-2 font-bold py-1'>
              Upgrade to Lobster
              <Badge
                variant='premium'
                className='uppercase text-sm py-1'
              >
                Pro
              </Badge>
            </div>
          </DialogTitle>
          <DialogDescription className='text-center pt-2 space-y-2 text-zinc-900 font-medium'>
            {tools.map((t) => (
              <Card
                key={t.label}
                className='p-3 border-black/5 flex items-center justify-between'
              >
                <div className='flex items-center gap-x-4'>
                  <div className={cn('p-2 w-fit rounded-md', t.bgColor)}>
                    <t.icon className={cn('w-6 h-6', t.color)} />
                  </div>
                  <div className='font-semibold text-sm'>{t.label}</div>
                </div>
                <Check className='text-primary w-5 h-5' />
              </Card>
            ))}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant='premium'
            size='lg'
            className='w-full font-bold'
          >
            <Zap className='w-4 h-4 mr-2 fill-white' />
            Purchase
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
