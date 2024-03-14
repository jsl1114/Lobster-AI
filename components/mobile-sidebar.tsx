'use client'

import { Menu } from 'lucide-react'
import { Button } from './ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import Sidebar from './sidebar'
import { useEffect, useState } from 'react'

const MobileSidebar = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <Sheet>
      <SheetTrigger>
        <Button
          variant='default'
          size='icon'
          className='md:hidden'
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent
        side='left'
        className='p-0'
      >
        <Sidebar />
      </SheetContent>
    </Sheet>
  )
}
export default MobileSidebar