import { auth } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'
import { increaseApiLimit, checkAPiLimit } from '@/lib/api-limit'

const replicate = new Replicate({ auth: process.env['REPLICATE_API_TOKEN'] })

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth()
    const body = await req.json()
    const { prompt } = body

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 400 })
    }

    if (!prompt) {
      return new NextResponse('Messages are required', { status: 400 })
    }

    const freeTrial = await checkAPiLimit()

    if (!freeTrial)
      return new NextResponse('Free trial has expired', { status: 403 }) //trigger the upgrade modal

    const output = await replicate.run(
      'anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351',
      {
        input: {
          fps: 24,
          model: 'xl',
          width: 1024,
          height: 576,
          prompt: prompt,
          num_interface_steps: 50,
          batch_size: 1,
          num_frames: 24,
          init_weight: 0.5,
          guidance_scale: 17.5,
          negative_prompt:
            'beautiful, 8k, perfect, award winning, national geographic',
        },
      }
    )

    await increaseApiLimit()

    return NextResponse.json(output)
  } catch (err) {
    console.log(`[VIDEO_ERROR]: ${err}`)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
