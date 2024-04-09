import { NextResponse } from "next/server";
import prisma from '../../lib/prismadb'
import getCurrentUser from '@/app/actions/getCurrentUser';

interface IParams {
    blogId?: string;
}

export async function GET(
    request: Request,
    { params }: { params: IParams }
) {
    try {
        const sections = await prisma.section.findMany();
        const currentUser = await getCurrentUser();

        if (!sections) {
            throw new Error('Sections not found');
        }

        return NextResponse.json({ sections, currentUser });
    } catch (error) {
        console.error('Error fetching sections:', error);
        return NextResponse.json({ error: params, message: "Failed in server side" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
