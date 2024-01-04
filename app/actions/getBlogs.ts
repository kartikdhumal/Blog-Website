import prisma from '../lib/prismadb';
import { IBlogParams } from '@/utils/mytypes';

export default async function getBlogs(params: IBlogParams) {
  try {
    const { userId, categories } = params || {}; // Default to an empty object if params is undefined

    let query: any = {};

    if (userId) {
      query.userId = userId;
    }

    if (categories) {
      query.categories = categories;
    }

    const blogs = await prisma.blog.findMany({
      where: query,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const safeblogs = blogs.map((blog) => ({
      ...blog,
      createdAt: blog.createdAt.toISOString(),
    }));

    return safeblogs;
  } catch (error: any) {
    throw new Error(error);
  }
}
  