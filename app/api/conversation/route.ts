import { auth } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs'
import { increaseApiLimit, checkAPiLimit } from '@/lib/api-limit'

const models = {
  chatgpt: 'https://api.openai.com/v1/',
  pawan: 'https://api.pawan.krd/v1/',
}

const openai = new OpenAI({
  baseURL: models.chatgpt,
  apiKey: process.env['OPENAI_API_KEY'],
})

const instructionMessage: ChatCompletionMessageParam = {
  role: 'system',
  content:
    'Your name is LobsterAI, a large language model trained by Jason Liu',
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth()
    const body = await req.json()
    const { messages } = body

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 400 })
    }

    if (!openai.apiKey) {
      return new NextResponse('API KEY NOT CONFIGURED', { status: 500 })
    }

    if (!messages) {
      return new NextResponse('Messages are required', { status: 400 })
    }

    const freeTrial = await checkAPiLimit()

    if (!freeTrial)
      return new NextResponse('Free trial has expired', { status: 403 }) //trigger the upgrade modal

    const response = await openai.chat.completions.create({
      messages: [instructionMessage, ...messages],
      model: 'gpt-3.5-turbo-0125',
    })

    await increaseApiLimit()

    return NextResponse.json(response.choices[0].message)
  } catch (err) {
    console.log(`[CODE_ERROR]: ${err}`)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
