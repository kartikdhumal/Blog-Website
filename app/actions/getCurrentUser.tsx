import { getServerSession } from "next-auth/next"
import { authOption } from "../api/auth/[...nextauth]/authOptions";
import prisma from '../lib/prismadb'

export async function getSession() {
  return await getServerSession(authOption)
}

export default async function getCurrentUser() {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }

    const currentUser = await prisma.user.findFirst({
      where: {
        email: session.user.email as string,
      },
    });


    if (!currentUser) {
      return null;
    }


    return {
      ...currentUser,
      createdAt: currentUser.createdAt.toISOString(),
      updatedAt: currentUser.updatedAt.toISOString(),
      emailVerified: currentUser.emailVerified?.toISOString() || null,
    };
  } catch (error: any) {
    return null;
  }
}