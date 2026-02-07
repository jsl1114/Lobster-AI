import { auth, clerkClient } from "@clerk/nextjs/server";

import prismadb from "./prismadb";
import { MAX_FREE_COUNTS } from "@/constants";
import { checkSubscription } from "./subscription";

export const increaseApiLimit = async () => {
  const { userId } = await auth();

  if (!userId) {
    return;
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  const { firstName, lastName, emailAddresses, imageUrl } = user;

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: {
      userId: userId,
    },
  });

  if (userApiLimit) {
    await prismadb.userApiLimit.update({
      where: { userId },
      data: { count: userApiLimit.count + 1 },
    });
  } else {
    await prismadb.userApiLimit.create({
      data: {
        userId: userId,
        count: 1,
      },
    });
    await prismadb.userInfo.create({
      data: {
        userId,
        firstName: firstName || "",
        lastName: lastName || "",
        email: emailAddresses[0].emailAddress,
        imageUrl,
      },
    });
  }
};

export const checkAPiLimit = async () => {
  const { userId } = await auth();

  if (!userId) {
    return false;
  }

  if (await checkSubscription()) {
    return true;
  }

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: { userId },
  });

  if (!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS) {
    return true;
  } else {
    return false;
  }
};

export const getApiLimitCount = async () => {
  const { userId } = await auth();

  if (!userId) return 0;

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: { userId },
  });

  if (!userApiLimit) return 0;

  return userApiLimit.count;
};
