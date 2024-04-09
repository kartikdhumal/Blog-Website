"use client"
import Image from "next/image";
import { SafeListing, SafeUser } from "@/types/type"
import axios from "axios";
import { useRouter } from 'next/navigation'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { BsFillPencilFill } from 'react-icons/bs'
import { useEffect, useState } from "react";
import { MdOutlineComment } from "react-icons/md";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FcLike } from "react-icons/fc";
import { Skeleton } from '@mui/material';
import Link from "next/link";

interface BlogProps {
  key: string
  data: SafeListing
  currentUser?: SafeUser | null
}

interface Section {
  id: string;
  imageSrc: string;
  description: string;
  blogId: string;
}

interface UserName {
  name: string;
}

export default function SingleBlog({ key, data, currentUser }: BlogProps) {
  const [userName, setUserName] = useState<UserName | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [showReadMore, setShowReadMore] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  useEffect(() => {
    async function fetchSections() {
      try {
        const response = await axios.get(`/api/sections`);
        const filteredSections = response.data.sections.filter((section: Section) => section.blogId === data.id);
        setSections(filteredSections);
      } catch (error) {
        console.error(error);
      }
      finally {
        setLoading(false);
      }
    }
    fetchSections();
  }, [data.id]);

  const onDelete = () => {
    setIsDeleting(true);
    axios.delete(`/api/blogs/${data.id}`)
      .then(() => {
        router.refresh()
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsDeleting(false);
      });
  }
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axios.get(`/api/blogs/${data.id}`);
        setUserName(response.data.user.name);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [data.id]);


  useEffect(() => {
    if (sections.length > 0 && sections[0].description) {
      setShowReadMore(true);
    }
  }, [sections]);


  const createdAtDate = data?.createdAt ? new Date(data.createdAt) : null;
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - (createdAtDate?.getTime() ?? currentDate.getTime());
  const getRelativeTime = (date: Date | string): string => {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <>
      {loading ? (
        <>
          <div className="mt-5 lg:w-[30%] lg:ml-[2%] sm:w-[90%] lg:h-[400px] sm:h-auto rounded-xl">
            <div className="">
              <div className="lg:flex gap-2 lg:flex-col justify-between bg-gray-400 rounded-xl cursor-pointer sm:flex flex-col">
                <Skeleton variant="rectangular" width="100%" height={200} />
                <div className="lg:w-auto flex flex-col pl-6 leading-[1.5] sm:w-auto">
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="60%" />
                  <div className="flex w-100 flex-col justify-end lg:pr-3 sm:py-3 pr-3">
                    <Skeleton variant="text" width={100} />
                    <Skeleton variant="text" width={100} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        sections.length > 0 && (
          <div className="mt-5 lg:w-[30%] lg:ml-[2%] bg-[#EDF4F2] hover:bg-gray-300 border border-black sm:w-[90%] lg:h-full sm:h-auto rounded-xl shadow-md">
            <div className="">
              <div className="lg:flex gap-2 lg:flex-col justify-between cursor-pointer sm:flex flex-col">
                {sections.length > 0 && (
                  <Link href={`/showblog/${data.id}`} className="flex justify-center w-full items-center">
                    <LazyLoadImage
                      className="lg:w-[100%] sm:w-[90%] object-fill h-56 rounded-2xl mt-5 lg:mx-0 sm:mx-5 transform transition-transform "
                      src={sections[0].imageSrc}
                      placeholderSrc={sections[0].imageSrc}
                      alt="Blog Image"
                    ></LazyLoadImage>
                  </Link>
                )}
                <div className="lg:w-auto flex flex-col  pl-6 sm:w-auto">
                  {sections.length > 0 && (
                    <b>
                      <Link
                        href={`/showblog/${data.id}`}
                        className="text-2xl h-auto font-bold text-[#001f50]"
                      >
                        {data.name}
                      </Link>
                    </b>
                  )}
                  <div className="flex w-100 flex-row justify-start items-start lg:pr-3 pb-3 py-3 pr-3">
                    {!loading && (
                      <>
                        {(data.userId === currentUser?.id || currentUser?.isAdmin) && (
                          <>
                            <div className="flex items-start justify-start w-2/4 gap-4">
                              <Link
                                href={`/blogs/${data.id}`}
                                className="lg:w-auto sm:w-auto text-white bg-gradient-to-r from-green-600 via-green-700 to-green-800 hover:bg-gradient-to-br focus:ring-4 focus:outline-none  dark:focus:ring-green-900 font-medium rounded-lg text-sm px-4 py-3 sm:p-2 text-center"
                              >
                                Edit
                              </Link>
                              <button
                                className="lg:w-auto sm:w-auto text-white bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:bg-gradient-to-br focus:ring-4 focus:outline-none dark:focus:ring-red-900 font-medium rounded-lg text-sm px-4 py-3 sm:p-2 text-center"
                                onClick={onDelete}
                              >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                              </button>
                            </div>
                          </>
                        )}
                      </>
                    )}
                    <div className="flex flex-col w-full">
                      <div className="flex flex-row justify-end">
                        <div className="vm:text-sm px-2 font-bold text-gray-700">{`${userName ? '- ' + userName : ''}`}</div>
                      </div>
                      <div className=" flex vm:text-xs items-center justify-end px-2 text-gray-700">
                        {getRelativeTime(data.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </>
  )
}
