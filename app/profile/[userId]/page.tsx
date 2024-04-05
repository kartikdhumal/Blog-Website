"use client"
import Input from '@/components/input/Input';
import axios from 'axios';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface UserData {
  name: string;
  email: string;
  hashedPassword?: string
}

interface IParams {
  userId: string;
}

export default function EditProfilePage({ params }: { params: IParams }) {
  const [state, setState] = useState<UserData>({ name: '', email: '' });
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const router = useRouter();
  const { userId } = params;

  useEffect(() => {
    const fetchUserData = async () => {
      setIsFetching(true);
      try {
        const response = await axios.get(`/api/editprofile/${userId}`);
        const userData: UserData = response.data;
        setState(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(event.target.value);
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const updatedUserData = { ...state };
      if (newPassword !== '') {
        updatedUserData.hashedPassword = newPassword;
      }

      await axios.put(`/api/editprofile/${userId}`, updatedUserData);
      toast.success('Profile Updated Successfully');
      router.push('/');
      router.refresh();
    } catch (error: any) {
      console.error(error);

      if (error.response) {
        const errorMessage = error.response.data.error;

        switch (errorMessage) {
          case 'Invalid email format':
            toast.error('Please provide a valid email address.');
            setState((prevState) => ({ ...prevState, email: '' }));
            break;
          case 'Name must be at least two characters long':
            toast.error('Name must be at least two characters long');
            setState((prevState) => ({ ...prevState, name: '' }));
            break;
          case 'Invalid name format':
            toast.error('Invalid Name Format');
            setState((prevState) => ({ ...prevState, name: '' }));
            break;
          default:
            toast.error('Something is wrong');
            setState({ email: '', name: '' });
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
    <div className="flex bg-[#001f50] lg:pt-28 sm:pt-0 flex-col md:flex-row h-screen fixed w-full justify-start items-start ">
      {
        isFetching ? <>
          <div className="rounded-lg w-full text-xl font-bold md:max-w-md text-gray-100 lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 h-auto px-6 lg:px-16 xl:px-12 lg:pt-0 sm:pt-60 flex justify-center items-center">
            Loading...
          </div>
        </> : <>
          <div className="rounded-lg w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 h-auto px-6 lg:px-16 xl:px-12 flex justify-center">
            <div className="w-full h-70">
              <form className="lg:mt-0 sm:mt-20" onSubmit={onSubmit} method="POST">
                <div>
                  <label className="block text-gray-100">Name</label>
                  <Input
                    placeholder="Name"
                    value={state.name}
                    name="name"
                    id="name"
                    style="w-full px-4 py-3 rounded-lg mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                    type="text"
                    onChange={handleChange}
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
                  <label className="block text-gray-100">New Password</label>
                  <Input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={handlePasswordChange}
                    style="w-full px-4 py-3 rounded-lg mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full text-[#001f50] bg-sky-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-md px-4 py-3 mt-6 text-center me-2 mb-2 border border-solid border-blue-700 shadow-md"
                  disabled={isLoading}
                >
                  {isLoading ? 'Updating Profile...' : 'Update Profile'}
                </button>
              </form>
            </div>
          </div>
        </>
      }
    </div>
  );
}
