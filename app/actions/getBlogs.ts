import prisma from '../lib/prismadb'

export interface IBlogParams {
  user?:string
  userId?: string;
  categories?: string
}

export default async function getBlogs(
  params: IBlogParams
) {
  try {

    const {
      userId,
      categories
    } = params

    let query:any = {};

    if(userId) {
      query.userId = userId
    }

    if(categories) {
      query.categories = categories
    }

    const blogs = await prisma.blog.findMany({
      where:query,
      orderBy: {
        createdAt: 'desc'
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