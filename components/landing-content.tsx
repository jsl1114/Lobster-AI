'use client'

import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

const featureIntros = [
  {
    emoji: '💬',
    title: 'Natural Language Understanding',
    description:
      'Engage in seamless conversations with our AI powered by the latest GPT models, providing natural and human-like responses.',
  },
  {
    emoji: '📸',
    title: 'Image Generation',
    description:
      'Transform text descriptions into stunning visuals. Whether it’s landscapes, characters, or abstract art, unleash your imagination.',
  },
  {
    emoji: '🎥',
    title: 'Video Creation',
    description:
      'Bring your ideas to life with AI-generated videos. From short clips to full-length productions, let our AI be your creative partner.',
  },
  {
    emoji: '💻',
    title: 'Code Generation',
    description:
      'Boost your productivity with AI-generated code snippets. Whether it’s automating tasks or prototyping, code smarter, not harder.',
  },
  {
    emoji: '🎵',
    title: 'Music Composition',
    description:
      'Experience the harmony of AI-generated music compositions. Create melodies, harmonies, and beats effortlessly.',
  },
]

export const LandingContent = () => {
  return (
    <div className='px-10'>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
        {featureIntros.map((t) => (
          <Card
            key={t.description}
            className='bg-[#202127] border-none text-white'
          >
            <CardHeader>
              <CardTitle className='flex items-center gap-x-2'>
                <div>
                  <p className='bg-[#2B2E36]  p-3 rounded-md h-fit w-fit mb-4'>
                    {t.emoji}
                  </p>
                  <p className='text-lg'>{t.title}</p>
                </div>
              </CardTitle>
              <CardContent className='pt-2 px-0 text-zinc-400 text-sm'>
                {t.description}
              </CardContent>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
