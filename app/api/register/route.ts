import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import prisma from '../../lib/prismadb';

export async function POST(
  request: Request
) {
  const body = await request.json();
  const { email, name, password } = body;

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

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword
    }
  });

  return NextResponse.json(user);
}
