import { NextResponse } from "next/server";
import prisma from '../../lib/prismadb'
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(
  request: Request, 
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return console.log('Hi');
    
  }
  const body = await request.json();
  const { comment, blogId} = body;

  const result = await prisma.comment.create({
    data: {
      comment,
      blogId,
      userId:currentUser.id
    }
  });

  return NextResponse.json(result);
}