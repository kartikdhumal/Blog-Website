import prisma from '../lib/prismadb'
interface IParams {
  blogId: string;
}

export default async function getBlogsById(
  params: IParams
) {
  try {
    const { blogId } = params;

    const blog = await prisma.blog.findUnique({
      where: {
        id: blogId,
      },
      include: {
        user: true,
        sections: true
      }
    });
    if (!blog) {
      return null;
    }

    return {
      ...blog,
      createdAt: blog.createdAt.toString(),
      
      user: {
        ...blog.user,
        createdAt: blog.user.createdAt.toString(),
        updatedAt: blog.user.updatedAt.toString(),
        emailVerified: 
          blog.user.emailVerified?.toString() || null,
      },
      sections: blog.sections.map(section => ({
        ...section,
         imageSrc: section.imageSrc.toString(),
        description: section.description.toString(),
      })),
    };
  } catch (error: any) {
    throw new Error("getBlogsById error" + error);
  }
}