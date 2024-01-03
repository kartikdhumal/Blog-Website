import prisma from '../lib/prismadb'
interface IParams {
  userId: string;
}

export default async function getUserById(
  params: IParams
) {
  try {
    const { userId } = params;

    const userinfo = await prisma.user.findUnique({
      where: {
        id: userId,
      }
    });

    if (!userinfo) {
      return null;
    }

    return {userinfo}
  } catch (error: any) {
    throw new Error(error);
  }
}