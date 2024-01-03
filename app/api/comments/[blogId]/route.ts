import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from '../../../lib/prismadb'

interface IParams {
    blogId?: string;
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
        const commentsWithUsers = await prisma.comment.findMany({
            where: {
                blogId: blogId,
            },
            include: {
                user: true,
            },
        });

        if (!commentsWithUsers) {
            throw new Error('Comments not found');
        }

        return NextResponse.json(commentsWithUsers);
    } catch (error) {
        console.error('Error fetching comments:', error);
        return NextResponse.json({ error: params, message: "Failed in server side" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}


export async function DELETE(
    request:Request, {
        params
    }: {params:IParams}
) {
    const currentUser = await getCurrentUser()
    if(!currentUser) {
        return NextResponse.error()
    }
    const {blogId} = params

    if(!blogId || typeof blogId !== 'string') {
        throw new Error('Invalid Id')
    }

    const blog = await prisma.comment.deleteMany({
        where: {
            id:blogId,
            userId:currentUser.id
        }
    });

    return NextResponse.json(blog)
}
