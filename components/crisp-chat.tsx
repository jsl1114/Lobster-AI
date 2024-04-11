'use client'

import { useEffect } from 'react'
import { Crisp } from 'crisp-sdk-web'

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure('2c3600d5-5caa-43fe-9bf7-e71a7539da7a')
  }, [])

  return null
}
