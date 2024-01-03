import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from '../../../lib/prismadb'
import bcrypt from 'bcrypt'
import { NextApiRequest, NextApiResponse } from "next";

interface IParams {
    userId?: string;
}

export async function GET(
    request: Request,
    { params }: { params: IParams }
) {
    const { userId } = params;

    if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid Id');
    }

    try {
        const users = await prisma.user.findUnique({
            where: {
                id: userId,
            }
        });

        if (!users) {
            throw new Error('User not found');
        }

        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json({ error: params, message: "Failed in server side" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function PUT( 
  request: Request, 
  {params}:{params:IParams}    
) {
  const {userId} = params
  const json = await request.json()
  const {name , email , hashedPassword} = json;
  const mypw = await bcrypt.hash(hashedPassword,12);
  const currentUser = await getCurrentUser()

  if(!currentUser) {
      return NextResponse.error()
  }

  if(!userId || typeof userId !== 'string') {
      throw new Error('Invalid Id')
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const nameRegex = /^[a-zA-Z\s]+$/;

  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
  }

  if (name.length < 2) {
    return NextResponse.json({ error: 'Name must be at least two characters long' }, { status: 400 });
  }

  if(!nameRegex.test(name)){
    return NextResponse.json({ error: 'Invalid name format' }, { status: 400 });
  }
  const updated = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      email,
      name,
      hashedPassword: mypw,
    },
  });

  return NextResponse.json(updated)

}