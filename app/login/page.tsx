"use client"
import Input from '@/components/input/Input'
import axios from 'axios'
import { error } from 'console'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { FormEvent, useState } from 'react'
import { signIn } from 'next-auth/react'
import toast from 'react-hot-toast'
import Email from 'next-auth/providers/email'

interface InitialStateProps {
    email:string,
    password:string
}

const initialState:InitialStateProps = {
   email: '',
   password:''
}

function page() {
    const [state , setState ] = useState(initialState);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    
    function handleChange(event:any) {
        setState({ ...state, [event.target.name]: event.target.value });
    }

    const onSubmit = async (event:any) => {
        event.preventDefault();
        setIsLoading(true);
        try {
          const callback = await signIn('credentials', {
            ...state,
            redirect: false,
          });
          if (callback?.ok) {
            router.push('/');
            toast.success('Login Successful');
            router.refresh();
          }
          if (callback?.error) {
            const errorMessage = callback?.error;
            switch (errorMessage) {
              case 'Invalid Data':
                toast.error('Please provide both email and password');
                break;
              case 'invalidup':
                toast.error('Invalid username or user not found');
                setState({ email : '' , password : ''});
                break;
              case 'Invalid Password':
                toast.error('Incorrect password');
                setState(prevState => ({ ...prevState, password: '' }));
                break;
              default:
                toast.error('Login failed. Please try again.');
                setState({ email : '' , password : ''});
                break;
            }
          }
        } catch (error) {
          console.error(error);
          toast.error('An unexpected error occurred. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };
      
      

    return (
        <div className="flex bg-[#001f50] lg:pt-28 sm:pt-0 flex-col md:flex-row h-screen fixed w-full justify-start items-start ">
            <div className="rounded-lg w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 h-auto px-6 lg:px-16 xl:px-12
            flex items-center justify-center">

                <div className="w-full h-100 lg:mt-0 sm:mt-20">
                    <form onSubmit={onSubmit} method="POST">
                        <div>
                            <label className="block text-gray-100">Email Address</label>
                            <Input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Email"
                                value={state.email}
                                onChange={handleChange}
                                style="w-full px-4 py-3 rounded-lg  mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                            />
                        </div>

                        <div className="mt-4">
                            <label className="block text-gray-100">Password</label>
                            <Input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Password"
                                minlength={6}
                                value={state.password}
                                onChange={handleChange}
                                style="w-full px-4 py-3 rounded-lg mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full text-white bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-md px-4 py-3 mt-6 text-center me-2 mb-2 border border-solid border-blue-700 shadow-md"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <hr className="my-6 border-gray-300 w-full" />

                    <p className="mt-8 text-white"> Haven't you got an account yet ? <Link href={'/register'} className="text-blue-200 hover:text-blue-700 font-semibold"> Sign Up</Link></p>
                </div>
            </div>
        </div>
    )
}

export default page
