import React, { useEffect } from 'react'
import getBlogs from '@/app/actions/getBlogs';
import { HomeProps } from '@/utils/mytypes';
import getCurrentUser from '@/app/actions/getCurrentUser';
import SingleBlog from './blog/SingleBlog';

async function Home(blogParams : HomeProps) {
    const currentUser = await getCurrentUser();
    const blogs = await getBlogs(blogParams);
  return (
    <main className="bg-gradient-to-t from-blue-500 via-blue-600 to-blue-700 flex min-h-screen flex-col items-center justify-between gap-4 p-4">
    {blogs.length > 0 ? (
      blogs.map((item: any) => (
        <SingleBlog key={item.id} data={item} currentUser={currentUser} />
      ))
    ) : (
      <div className="mt-5 rounded-lg flex lg:w-[72%] sm:w-[90%] flex-col items-center shadow-md justify-center h-full">
        <div className="font-bold text-3xl mb-8 text-sky-100" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
          No blogs yet 😞
        </div>
      </div>
    )}
  </main>
  )
}

export default Home
