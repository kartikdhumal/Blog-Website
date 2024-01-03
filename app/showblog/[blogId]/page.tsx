import getCurrentUser from "@/app/actions/getCurrentUser"
import getBlogsById from "@/app/actions/getBlogsById";
import SingleBlog from "@/components/blog/SingleBlog";
import ShowBlog from "@/components/blog/ShowBlog";


interface IParams {
    blogId:string,
}

export default async function page({params}:{params:IParams}) {
    const blog  = await getBlogsById(params)
    const currentUser = await getCurrentUser();
    console.log(currentUser);
    const date = blog?.createdAt
    const date2 = new Date(date ?? 2023).toDateString()

 
  return (


    <div className="">
        <div>
        <ShowBlog
          name={blog?.name}
          description={blog?.description}
          blogId={blog?.id}
          imageSrc={blog?.imageSrc}
          createdAt={blog?.createdAt}
          currentUserId={currentUser?.id}
          userMade = {blog?.user.id}
          nameUser= {blog?.user.name}
        />
      </div>
    </div>
  )
}