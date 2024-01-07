"use client"
import Image from "next/image";
import { SafeListing, SafeUser } from "@/types/type"
import axios from "axios";
import { useRouter } from 'next/navigation'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { BsFillPencilFill } from 'react-icons/bs'
import { useEffect, useState } from "react";
import { MdOutlineComment } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import Link from "next/link";

interface BlogProps {
  key: string
  data: SafeListing
  currentUser?: SafeUser | null
}

interface UserName {
  name: string;
}

export default function SingleBlog({ key, data, currentUser }: BlogProps) {
  const [userName, setUserName] = useState<UserName | null>(null);  
  const router = useRouter();

  const onLike = () => {
    axios.post(`/api/like/${data.id}`)
      .then(() => {
        router.refresh()
      })
      .catch((error) => {
      })
      .finally(() => {
      })
  }

  const onDelete = () => {
    axios.delete(`/api/blogs/${data.id}`)
      .then(() => {
        router.refresh()
      })
      .catch((error) => {
      })
      .finally(() => {
      })
  }

  useEffect(() => {
  async function fetchUser() {
    try {
      const response = await axios.get(`/api/blogs/${data.userId}`);
      setUserName(response.data);
    } catch (error) {
      console.error(error);
    }
  }
  fetchUser();
}, [data.id]);
  const createdAtDate = data?.createdAt ? new Date(data.createdAt) : null;
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - (createdAtDate?.getTime() ?? currentDate.getTime());
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const getRelativeTime = (days: number): string => {
    if (days === 0) {
      return 'Today';
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days > 1) {
      return `${days} days ago`;
    } else {
      return 'Future date';
    }
  };
  const descriptionLimit = 550;
  const truncatedDescription = data.description.slice(0, descriptionLimit);
  const showReadMore = data.description.length > descriptionLimit;


  return (
    <div className="mt-5 lg:w-[72%] sm:w-[90%] bg-sky-100 p-4 rounded-xl border-2 border-blue-700 shadow-md">
      <div className="">
        <div className="lg:flex gap-2 lg:flex-row justify-between  sm:flex flex-col">
          <Image width={400} className="lg:w-[500px]  sm:w-auto rounded-md object-contain" height={500} src={data.imageSrc} alt="Blog Image" />
          <div className="lg:w-auto flex flex-col pl-2 gap-4 leading-[1.5] sm:w-auto">
            <b><h1 onClick={() => router.push(`/showblog/${data.id}`)} className="text-2xl lg:pt-5 font-semibold text-blue-800">{data.name}</h1></b>
            <p className="text-gray-800 " onClick={() => router.push(`/showblog/${data.id}`)}>
              {truncatedDescription}
              {showReadMore && (
                <span className="text-blue-600 cursor-pointer" onClick={() => router.push(`/showblog/${data.id}`)}>
                  {" "}
                  ...Read more
                </span>
              )}
            </p>
                    <div className="flex w-100 flex-row justify-end">
          {data.userId === currentUser?.id ? (
            <>
              <div className="flex items-center w-2/4 gap-4 mt-4">
                <button className="lg:w-auto sm:w-auto text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none  dark:focus:ring-green-800 font-medium rounded-lg text-sm px-4 py-3 sm:p-2 text-center" onClick={() => router.push(`/blogs/${data.id}`)}>Edit</button>
                <button className="lg:w-auto sm:w-auto text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none dark:focus:ring-red-800 font-medium rounded-lg text-sm px-4 py-3 sm:p-2 text-center" onClick={onDelete}>Delete</button>
              </div>
              <div className="flex flex-col w-2/4 vm:mt-5">
                <div className="flex flex-row justify-end">
                <div className="vm:text-sm px-2 font-bold text-blue-800">{`- ${userName?.name ? userName.name : 'Anonymous'}`}</div>
                </div>
                <div className=" flex vm:text-xs items-center justify-end px-2 text-gray-600">{getRelativeTime(daysDifference)}</div>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col w-full justify-end items-end">
                <div className="flex flex-row justify-end">
                  <div className="vm:text-sm px-2 font-bold text-blue-800">{`- ${userName?.name ? userName.name : 'Anonymous'}`}</div>
                </div>
                <div className="vm:text-xs flex items-center justify-end px-6 text-gray-600">{getRelativeTime(daysDifference)}</div>
              </div>
            </>
          )}
        </div>
          </div>
        </div>
      </div>
    </div>
  )
}