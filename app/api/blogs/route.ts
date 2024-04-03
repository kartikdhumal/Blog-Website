import { NextResponse } from "next/server";
import prisma from '../../lib/prismadb';
import getCurrentUser from "@/app/actions/getCurrentUser";

interface SectionInput {
  imageSrc: string;
  description: string;
}

interface CreateBlogRequest {
  name: string;
  sections: SectionInput[];
}

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json() as CreateBlogRequest;

  const { name, sections } = body;
  if (!name) {
    return new Response("Title is required.", { status: 400 });
  }

  if (!Array.isArray(sections)) {
    return new Response("Invalid sections data.", { status: 400 });
  }

  try {
    const blog = await prisma.blog.create({
      data: {
        name,
        user: { connect: { id: currentUser.id } },
        updatedAt: new Date()
      }
    });

    const createdSections = await Promise.all(sections.map(section => {
      return prisma.section.create({
        data: {
          ...section,
          blog: { connect: { id: blog.id } }
        }
      });
    }));

    await prisma.blog.update({
      where: { id: blog.id },
      data: {
        sections: {
          connect: createdSections.map(section => ({ id: section.id }))
        }
      }
    });

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error creating blog:', error);
    return new Response("An error occurred while creating the blog.", { status: 500 });
  }
}
