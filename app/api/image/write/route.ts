import { writeFileSync } from 'fs'
import { NextRequest, NextResponse } from 'next/server'

export function POST(req: NextRequest) {
  writeFileSync('./images.json', JSON.stringify(req.body))
  return new NextResponse('written', { status: 200 })
}
