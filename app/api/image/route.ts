import { auth } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
})

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth()
    const body = await req.json()
    const { prompt, amount = 1, resolution = '512x512' } = body

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 400 })
    }

    if (!openai.apiKey) {
      return new NextResponse('API KEY NOT CONFIGURED', { status: 500 })
    }

    if (!prompt) {
      return new NextResponse('Prompt is required', { status: 400 })
    }
    if (!amount) {
      return new NextResponse('amount is required', { status: 400 })
    }
    if (!resolution) {
      return new NextResponse('Resolution is required', { status: 400 })
    }

    const response = await openai.images.generate({
      model: 'dall-e-2',
      prompt: prompt,
      n: parseInt(amount, 10),
      size: resolution,
    })

    console.log(response)

    return NextResponse.json(response.data)
  } catch (err) {
    console.log(`[IMAGE_ERROR]: ${err}`)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
