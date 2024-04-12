'use client'
import { useAuth } from '@clerk/nextjs'
import Link from 'next/link'
import TypeWriterComponent from 'typewriter-effect'
import { Button } from './ui/button'

export const LandingHero = () => {
  const { isSignedIn } = useAuth()
  return (
    <div className='text-white font-bold py-16 text-center space-y-5'>
      <div className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl sapce-y-5 font-extrabold'>
        <h1>The Best AI Tool for</h1>
        <div className='text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600'>
          <TypeWriterComponent
            options={{
              strings: [
                'Chatbot.',
                'Image Generation.',
                'Music Generation.',
                'Video Generation.',
                'Code Generation.',
              ],
              autoStart: true,
              loop: true,
              cursor: '/',
            }}
          />
        </div>
      </div>
      <div className='text-sm md:text-xl font-light text-zinc-400'>
        Create content with AI 10x faster
      </div>
      <div>
        <Link href={isSignedIn ? '/dashboard' : '/sign-up'}>
          <Button
            variant={isSignedIn ? 'default' : 'premium'}
            className='md:texr-lg p-4 md:p-6 rounded-full'
          >
            {isSignedIn ? 'Dashboard' : 'Start Generating For Free'}
          </Button>
        </Link>
      </div>
      <div className='text-zinc-400 text-xs md:text-sm font-normal'>
        No credit card required.
      </div>
    </div>
  )
}
