import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from '../../../lib/prismadb'


interface IParams {
  blogId?: string
}

export async function DELETE(
  request: Request,
  { params }: { params: { blogId: string } }
) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.error();
  }

  const { blogId } = params;

  if (!blogId || typeof blogId !== 'string') {
    throw new Error('Invalid Id');
  }

  await prisma.comment.deleteMany({
    where: {
      blogId: blogId,
    },
  });

  await prisma.section.deleteMany({
    where: {
      blogId: blogId,
    },
  });

  const deletedBlog = await prisma.blog.delete({
    where: {
      id: blogId,
    },
  });

  return NextResponse.json(deletedBlog);
}

export async function PUT(
  request: Request,
  { params }: { params: { blogId: string } }
) {
  const { blogId } = params;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  if (!blogId || typeof blogId !== 'string') {
    throw new Error('Invalid Id');
  }

  const json = await request.json();

  const updatedSections = json.sections.filter((section: any) => section.id);
  const newSections = json.sections.filter((section: any) => !section.id);

  const updatedBlog = await prisma.blog.update({
    where: {
      id: blogId,
    },
    data: {
      ...json,
      sections: {
        deleteMany: {
          id: {
            notIn: updatedSections.map((section: any) => section.id)
          }
        },
        updateMany: updatedSections.map((section: any) => ({
          where: {
            id: section.id,
          },
          data: {
            imageSrc: section.imageSrc,
            description: section.description,
          },
        })),
        create: newSections.map((section: any) => ({
          imageSrc: section.imageSrc,
          description: section.description,
        })),
      },
    },
    include: {
      sections: true,
    },
  });

  return NextResponse.json(updatedBlog);
}


export async function GET(request: Request, { params }: { params: { blogId: string } }) {
  const { blogId } = params;

  if (!blogId || typeof blogId !== 'string') {
    throw new Error('Invalid blogId');
  }

  const blog = await prisma.blog.findUnique({
    where: {
      id: blogId
    },
    include: {
      sections: true,
      comments: true,
      user: true
    }
  });

  if (!blog) {
    throw new Error('Blog Not Found');
  }

  return NextResponse.json(blog);
}