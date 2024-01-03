import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from '../../../lib/prismadb'


interface IParams {
    blogId?:string
}

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: { blogId: string };
  }
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

  const deletedBlog = await prisma.blog.deleteMany({
    where: {
      id: blogId,
      userId: currentUser.id,
    },
  });

  return NextResponse.json(deletedBlog);
}

export async function PUT( 
    request: Request, 
    {params}:{params:IParams}    
) {
    const {blogId} = params
    const json = await request.json()
    const currentUser = await getCurrentUser()


    if(!currentUser) {
        return NextResponse.error()
    }

    if(!blogId || typeof blogId !== 'string') {
        throw new Error('Invalid Id')
    }

    const updated = await prisma.blog.update({
        where: {
            id: blogId,
        },
        data:  json
    })

    return NextResponse.json(updated)

}

export async function GET(
    request: Request,
    { params }: { params: IParams }
  ) {
    const { blogId } = params;
  
    if (!blogId || typeof blogId !== 'string') {
      throw new Error('Invalid Id');
    }
  
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: blogId,
        },
      });
      if (!user) {
        throw new Error('User not found');
      }
      return NextResponse.json(user);
    } catch (error) {
      return NextResponse.json({ error: params , message : "Failed in server side" });
    } finally {
      await prisma.$disconnect();
    }
  }