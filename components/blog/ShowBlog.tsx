"use client"
import axios from 'axios';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { RWebShare } from "react-web-share";
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { RiDeleteBin5Fill } from "react-icons/ri";
import SendIcon from '@mui/icons-material/Send';
import { FaCaretDown } from "react-icons/fa";
import { FaCaretUp } from "react-icons/fa";

interface BlogProps {
    name?: string;
    sections?: {
        imageSrc: string;
        description: string;
    }[];
    blogId?: string;
    createdAt?: string;
    userId?: string;
    currentUserId?: string;
    userMade?: string;
    nameUser?: string;
}

interface InitalStateProps {
    name: string,
    description: string
    imageSrc: string
}

interface Comment {
    id: string;
    user: {
        id: string;
        name: string;
    };
    createdAt: string;
    comment: string;
}

interface Section {
    id: string;
    imageSrc: string;
    description: string;
    blogId: string;
}

interface deleteId {
    id?: string
}

const initialState: InitalStateProps = {
    name: '',
    description: '',
    imageSrc: ''
}

function ShowBlog({ name, sections, blogId, createdAt, currentUserId, userMade, nameUser }: BlogProps) {
    const [userName, setUserName] = useState({});
    const [isLoading, setIsLoading] = useState(false)
    const [comments, setComments] = useState<Comment[]>([]);
    const [comment, setComment] = useState('');
    const [totalComment, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [sectionslist, setSections] = useState<Section[]>([]);
    const [commentsExpanded, setCommentsExpanded] = useState(false);

    const router = useRouter()
    const currentDate = new Date();

    const getRelativeTime = (date: Date | string): string => {
        if (typeof date === 'string') {
            date = new Date(date);
        }
        const options: Intl.DateTimeFormatOptions = { month: 'short', day: '2-digit', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        async function fetchSections() {
            try {
                setLoading(true);
                const response = await axios.get(`/api/sections`);
                const filteredSections = response.data.filter((section: Section) => section.blogId === blogId);
                setSections(filteredSections);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        }
        fetchSections();
    }, [blogId]);


    const getRelativeTimeForComments = (commentCreatedAt: string | Date | undefined) => {
        if (!commentCreatedAt) {
            return '';
        }
        const commentDate = typeof commentCreatedAt === 'string' ? new Date(commentCreatedAt) : commentCreatedAt;
        const commentTimeDifference = currentDate.getTime() - commentDate.getTime();
        const commentDaysDifference = Math.floor(commentTimeDifference / (1000 * 60 * 60 * 24));
        return getRelativeTime(commentDate);
    };


    const handleCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setComment(e.target.value);
    };

    const handleSubmit = async (event: FormEvent) => {
        if (currentUserId) {
            setIsLoading(true);
            event.preventDefault();
            axios.post('/api/comments', { comment: comment, blogId: blogId })
                .then((response) => {
                    setComments((prevComments) => [...prevComments, response.data]);
                    toast.success('Submitted successfully');
                    setComment('');
                    fetchComment();
                    fetchData();
                    router.push(`/showblog/${blogId}`);
                })
                .catch(() => {
                    alert("Login to add comment");
                    setComment('');
                    router.refresh();
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            alert("Login to add comment");
            setComment('');
        }
    };

    const fetchComment = async () => {
        try {
            const response = await axios.get(`/api/comments/${blogId}`);
            setTotal(response.data.length);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };
    const fetchData = async () => {
        try {
            const response = await axios.get(`/api/comments/${blogId}`);
            setComments(response.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };
    useEffect(() => {
        fetchData();
        fetchComment();
    }, [blogId]);

    const onDelete = (id: string) => {
        axios.delete(`/api/comments/${id}`)
            .then(() => {
                setComments((prevComments) => prevComments.filter(comment => comment.id !== id));
                toast.success('Comment Deleted');
                fetchComment();
            })
            .catch((error) => {
                console.error('Error deleting comment:', error);
                toast.error('Error deleting comment');
            })
            .finally(() => {
            });
    }


    return (
        <div className="w-full  h-auto bg-[#001f50]">
            {loading ? (
                <div className='flex flex-col min-h-screen font-bold text-sky-100 text-xl justify-start pt-60 items-center p-5'>
                    Loading...
                </div>
            ) : (
                <div className="mybox flex flex-col justify-center items-center lg:p-5 sm:p-0">
                    <div className="title text-3xl font-extrabold p-7  text-white capitalize">
                        {name}
                    </div>


                    {
                        sectionslist.map((sections, index) => (
                            <>
                                <div className="image relative mb-6">
                                    <Image
                                        height={350}
                                        width={900}
                                        className="rounded-lg px-5 shadow-md"
                                        src={sections.imageSrc ?? ''}
                                        alt="Blog Image"
                                    />
                                </div>
                                <div className="description lg:w-[70%] text-white text-xl p-5">
                                    {sections.description.split('.').map((paragraph, index) => (
                                        <React.Fragment key={index}>
                                            <p>{paragraph}</p>
                                            {index !== sections.description.split('.').length - 1 && <br />}
                                        </React.Fragment>
                                    ))}
                                </div>


                            </>
                        ))
                    }

                    <div className="description lg:w-[50%] sm:w-[100%] p-5 text-right flex flex-col">
                        <div className="date text-gray-200 text-md">
                            {getRelativeTimeForComments(createdAt)}
                        </div>
                        <div className="name text-md text-gray-200 font-bold">{`- ` + nameUser}</div>
                        <div className='w-full flex justify-end my-5'>
                            <RWebShare
                                data={{
                                    text: name?.toUpperCase(),
                                    url: `https://dktales-kartikdhumal.vercel.app/showblog/${blogId}`,
                                    title: name,
                                }}
                                onClick={() =>
                                    console.log("shared successfully!")
                                }
                            >
                                <button className='border-2 text-white font-bold bg-[#001f50] hover:bg-[#EDF4F2] hover:text-[#001f50] hover:border-[#001f50] focus:ring-4 focus:outline-none rounded-lg text-sm px-3 py-2 text-center me-2 mb-2'>Share <SendIcon style={{ fontSize: 13, marginLeft: "3px" }} /> </button>
                            </RWebShare>
                        </div>
                    </div>

                    <div className="mb-4 lg:w-[50%] sm:w-[90%]">
                        <form onSubmit={handleSubmit} className='w-full' method="post">
                            <textarea
                                required
                                value={comment}
                                onChange={handleCommentChange}
                                name="textarea-name"
                                rows={5}
                                cols={60}
                                placeholder="Add comment...."
                                className="focus:shadow-soft-primary-outline text-md min-h-unset leading-5.6 ease-soft resize-none block h-auto w-full appearance-none rounded-lg border border-solid border-blue-700 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                            />

                            <button
                                type="submit"
                                className="w-full text-[#001f50] bg-blue-200 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-md px-4 py-2 mt-6 text-center me-2 mb-2 border border-solid border-blue-700 shadow-md"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Submitting...' : 'Submit'}
                            </button>


                        </form>
                    </div>
                    <div
                        onClick={() => setCommentsExpanded(!commentsExpanded)}
                        className="lg:w-[40%] sm:w-[90%] bg-[#001f50] text-[#EDF4F2] border-2 flex justify-center items-center p-1 rounded-lg mb-4"
                    >
                        <span className="mr-1 text-lg">{totalComment}</span>
                        <span className="text-lg">{comments.length == 1 ? "comment" : "comments"}</span>
                        {!commentsExpanded ? <FaCaretDown style={{ marginLeft: "5px" }} /> : <FaCaretUp />}
                    </div>

                    <style jsx>{`
      .comments-container {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease-out;
        width: 100%;
      }

      .comments-container.expanded {
        max-height: 1000px;
        transition: max-height 0.3s ease-in;
      }

      .comments-container > * {
        opacity: 0;
        transform: translateY(-20px);
        transition: opacity 0.3s ease-in, transform 0.3s ease-in-out;
      }

      .comments-container.expanded > * {
        opacity: 1;
        transform: translateY(0);
      }
    `}</style>

                    <div className={`comments-container ${commentsExpanded ? 'expanded' : ''}`}>
                        {comments.length === 0 ? (
                            <div className="comment font-bold items-center lg:w-[40%] mt-8 flex justify-center"></div>
                        ) : (
                            comments.map((data) => (
                                <div
                                    className="comment lg:w-full sm:w-[100%] mt-2 flex justify-start"
                                    key={data.id}
                                >
                                    <div className="flex w-full justify-center items-center relative top-1/3">
                                        <div className="lg:w-[40%] sm:w-[90%] p-4 mb-8 border rounded-lg bg-[#EDF4F2] shadow-md">
                                            <div className="flex flex-col gap-0">
                                                <div className="flex w-full flex-row items-center justify-between">
                                                    <p className="font-bold text-lg text-blue-700">

                                                        {
                                                            data.user
                                                                ? (
                                                                    userMade === data.user?.id
                                                                        ? (
                                                                            <span>
                                                                                {data.user?.name ? `${data.user.name}` : 'Anonymous '}
                                                                                <span className="text-gray-500 text-sm"> - (creator)</span>
                                                                            </span>
                                                                        )
                                                                        : (
                                                                            <span>{data.user?.name ? data.user.name : 'Anonymous'}</span>
                                                                        )
                                                                )
                                                                : "Anonymous"
                                                        }






                                                    </p>
                                                    {data.user && currentUserId === data.user.id ? (
                                                        <a
                                                            onClick={() => onDelete(data.id)}
                                                            className="text-gray-600 text-xl cursor-pointer"
                                                        >
                                                            <RiDeleteBin5Fill />
                                                        </a>
                                                    ) : null}

                                                </div>
                                                <p className="text-gray-500 text-sm">
                                                    {getRelativeTimeForComments(data.createdAt)}
                                                </p>
                                            </div>
                                            <p className="mt-4 text-gray-800">{data.comment}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>

    )
}

export default ShowBlog
