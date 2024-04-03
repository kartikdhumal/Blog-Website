import { NextResponse } from "next/server";
import prisma from '../../lib/prismadb'

interface IParams {
    blogId?: string;
}

export async function GET(
    request: Request,
    { params }: { params: IParams }
) {
    try {
        const sections = await prisma.section.findMany();

        if (!sections) {
            throw new Error('Sections not found');
        }

        return NextResponse.json(sections);
    } catch (error) {
        console.error('Error fetching sections:', error);
        return NextResponse.json({ error: params, message: "Failed in server side" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
