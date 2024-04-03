import getCurrentUser from "@/app/actions/getCurrentUser"
import getBlogsById from "@/app/actions/getBlogsById";
import SingleBlog from "@/components/blog/SingleBlog";
import ShowBlog from "@/components/blog/ShowBlog";

interface IParams {
    blogId: string,
}

export default async function page({ params }: { params: IParams }) {
    const blog = await getBlogsById(params);
    const currentUser = await getCurrentUser();
    const date = blog?.createdAt;
    const date2 = new Date(date ?? 2023).toDateString();

    return (
        <div className="">
            <div>
                <ShowBlog
                    name={blog?.name}
                    sections={blog?.sections}
                    blogId={blog?.id}
                    createdAt={blog?.createdAt}
                    currentUserId={currentUser?.id}
                    userMade={blog?.user.id}
                    nameUser={blog?.user.name ?? "Anonymous"}
                />
            </div>
        </div>
    );
}
