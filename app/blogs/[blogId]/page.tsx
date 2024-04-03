import getBlogsById from "@/app/actions/getBlogsById";
import BlogId from "@/components/blog/BlogId";


interface IParams {
  blogId: string,
}

export default async function page({ params }: { params: IParams }) {
  const blog = await getBlogsById(params)

  return (


    <div className="">
      <div>
        <BlogId
          name={blog?.name ?? ""}
          sections={blog?.sections}
          blogId={blog?.id ?? ""}
        />
      </div>
    </div>
  )
}