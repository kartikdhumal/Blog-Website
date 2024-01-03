import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';
import { SafeUser } from '@/types/type';
import { useId } from 'react';

interface UserMenuProps{
  currentUser : SafeUser | null
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse, {currentUser}: UserMenuProps
) {
  const userId = currentUser?.id;
  try {
    if (!currentUser?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
  }
    const { comment, blogId , userId } = req.body;

    console.log('Received comment data:', { comment, blogId , userId});

    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
    });

    console.log('Retrieved blog:', blog);

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const createdComment = await prisma.comment.create({
      data: {
        comment,
        blogId,
        userId,
      },
    });

    console.log('Created comment:', createdComment);

    res.status(201).json(createdComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
