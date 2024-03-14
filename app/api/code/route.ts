import { auth } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs'

const models = {
  chatgpt: 'https://api.openai.com/v1/',
  pawan: 'https://api.pawan.krd/v1/',
}

const openai = new OpenAI({
  baseURL: models.pawan,
  apiKey: process.env['API_PROXY_KEY'],
})

const instructionMessage: ChatCompletionMessageParam = {
  role: 'system',
  content:
    'You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations. Make sure your markdown code render correctly with the react-markdown package',
}

export async function POST(req: NextRequest, res: NextResponse) {
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

    const response = await openai.chat.completions.create({
      messages: [instructionMessage, ...messages],
      model: 'pai-001',
    })

    return NextResponse.json(response.choices[0].message)
  } catch (err) {
    console.log(`Conversation error: ${err}`)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
