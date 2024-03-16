import { auth } from '@clerk/nextjs'

import prismadb from './prismadb'
import { MAX_FREE_COUNTS } from '@/constants'
import { clerkClient } from '@clerk/nextjs/server'

export const increaseApiLimit = async () => {
  const { userId } = auth()

  if (!userId) {
    return
  }

  const user = await clerkClient.users.getUser(userId)

  const { firstName, lastName, emailAddresses, imageUrl } = user

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: {
      userId: userId,
    },
  })

  if (userApiLimit) {
    await prismadb.userApiLimit.update({
      where: { userId },
      data: { count: userApiLimit.count + 1 },
    })
  } else {
    await prismadb.userApiLimit.create({
      data: {
        userId: userId,
        count: 1,
      },
    })
    await prismadb.userInfo.create({
      data: {
        userId,
        firstName: firstName || '',
        lastName: lastName || '',
        email: emailAddresses[0].emailAddress,
        imageUrl,
      },
    })
  }
}

export const checkAPiLimit = async () => {
  const { userId } = auth()

  if (!userId) {
    return false
  }

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: { userId },
  })

  if (!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS) {
    return true
  } else {
    return false
  }
}

export const getApiLimitCount = async () => {
  const { userId } = auth()

  if (!userId) return 0

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: { userId },
  })

  if (!userApiLimit) return 0

  return userApiLimit.count
}
