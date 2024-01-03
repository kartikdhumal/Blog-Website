import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prismadb'

async function handler(req: NextApiRequest,res: NextApiResponse) {
  const { blogId } = req.query;
  if (!blogId || typeof blogId !== 'string') {
    return res.status(400).json({ error: 'Invalid blogId' });
  }

  try {
    const totalCommentsCount = await prisma.comment.count({
      where: {
        blogId: blogId,
      },
    });

    return res.json(totalCommentsCount);
  } catch (error) {
    console.error('Error fetching comments count:', error);
    return res.status(500).json({ error: 'Failed to fetch comments count' });
  } finally {
    await prisma.$disconnect();
  }
}
