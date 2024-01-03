"use client"
import Input from '@/components/input/Input'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { FormEvent, useState } from 'react'
import toast from 'react-hot-toast'

interface InitialStateProps {
  name: string,
  email: string,
  password: string
}

const initialState: InitialStateProps = {
  name: '',
  email: '',
  password: ''
}

function page() {
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  function handleChange(e: any) {
    setState({ ...state, [e.target.name]: e.target.value });
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
  
    try {
      await axios.post('/api/register', state);
        toast.success('Your account has been created')
        setState({ name : ' ', email : '' , password : ''});
        router.push('/login');
    } catch (error:any) {  
      console.error(error);
      if (error.response) {
        const errorMessage = error.response.data.error;
        switch (errorMessage) {
          case 'Invalid email format':
            toast.error('Please provide a valid email address.');
            setState(prevState => ({ ...prevState, email: '' }));
            break;
          case 'Name must be at least two characters long':
            toast.error('Name must be at least two characters long');
            setState(prevState => ({ ...prevState, name: '' }));
            break;
          case 'Invalid name format':
            toast.error('Invalid Name Format');
            setState(prevState => ({ ...prevState, name: '' }));
            break;
          default:
            toast.error('Registration failed. Please try again.');
            setState({ email : '' , name : '' , password : ''});
            break;
        }
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  

  return (
    <div className="flex bg-gradient-to-t from-blue-500 via-blue-600 to-blue-700 h-screen items-center">
      <div className="rounded-lg w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 h-auto px-6 lg:px-16 xl:px-12
         flex items-center justify-center">

        <div className="w-full h-100">
          <form className="" onSubmit={onSubmit} method="POST">
            <div>
              <label className="block text-gray-100">Name</label>
              <Input
                placeholder="Name"
                name="name"
                id="name"
                style="w-full px-4 py-3 rounded-lg mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                type="text"
                onChange={handleChange}
                value={state.name}
              />
            </div>
            <div className="mt-4">
              <label className="block text-gray-100">Email Address</label>
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                value={state.email}
                onChange={handleChange}
                style="w-full px-4 py-3 rounded-lg mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
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
              {isLoading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>

          <hr className="my-6 border-gray-300 w-full" />

          <p className="mt-8 text-white">
            Do you have an account?{" "}
            <Link href={"/login"} className="text-blue-200 hover:text-blue-700 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default page;
