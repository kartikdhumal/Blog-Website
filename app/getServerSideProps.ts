import { IBlogParams } from "./actions/getBlogs";
import getCurrentUser from "./actions/getCurrentUser";
import getBlogs from "./actions/getBlogs";

export async function getServerSideProps() {
    try {
      const blogParams: IBlogParams = { /* provide your parameters */ };
      const currentUser = await getCurrentUser();
      const blogs = await getBlogs(blogParams);
  
      return {
        props: {
          blogs,
          currentUser,
        },
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      return {
        props: {
          blogs: [],
          currentUser: null,
        },
      };
    }
  }