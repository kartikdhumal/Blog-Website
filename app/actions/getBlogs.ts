import prisma from '../lib/prismadb';
import { HomeProps } from '@/utils/mytypes';

export default async function getBlogs(params: HomeProps): Promise<any[]> {
  try {
    const { blogParams } = params || {};
    let query: any = {};
    const userId = blogParams?.userId;
    const categories = blogParams?.categories;

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
      updatedAt: blog.updatedAt ? blog.updatedAt.toISOString() : null,
    }));

    return safeblogs;
  } catch (error: any) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}
