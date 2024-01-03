'use client'

import React, { ChangeEvent, FormEvent, useMemo, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import Input from '@/components/input/Input'
import ImageUpload from '@/components/input/ImageUpload'



interface InitalStateProps {
    name?: string,
    imageSrc: string
    description: string
}

const initialState: InitalStateProps = {
    name: '',
    imageSrc: '',
    description: ''
}


export default function page() {

    const [state, setState] = useState(initialState)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const onSubmit = (event: FormEvent) => {
        setIsLoading(true);
        event.preventDefault(); 
        if (state.name == '' || state.imageSrc == '' || state.description == '') {
          toast.error('Fill the data');
          setIsLoading(false);
        } else {
          axios
            .post('/api/blogs', state)
            .then(() => {
              toast.success('Created successfully');
              router.push('/');
              router.refresh();
            })
            .catch(() => {
              toast.error('Something went wrong');
            })
            .finally(() => {
              setIsLoading(false);
            });
        }
      };
      

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        setState({ ...state, [event.target.name]: event.target.value });
    }
    const setCustomValue = (id: any, value: any) => {
        setState((prevValues) => ({
            ...prevValues,
            [id]: value,
        }));
    };


    return (
        <form
  onSubmit={onSubmit}
  className="bg-gradient-to-t h-screen from-blue-500 via-blue-600 to-blue-700 overflow-hidden mx-auto py-0 px-4 sm:px-8 lg:px-16 flex  items-center lg:flex-col sm:flex flex-col border-2 border-blue-700 "
>
  <div className='pt-24'>
    <ImageUpload
      value={state.imageSrc}
      onChange={(value) => setCustomValue('imageSrc', value)}
    />
  </div>

  <div className="flex flex-col justify-center lg:max-w-[450px] w-full mx-auto gap-4">
    <Input
      type="text"
      name="name"
      id="name"
      placeholder="Blog Header"
      value={state.name}
      onChange={handleChange}
      style="w-full px-4 py-3 mt-5 rounded-lg mt-2 border font-bold focus:border-blue-500 focus:bg-white focus:outline-none"
    />
    <Input
      big
      type="text"
      name="description"
      id="description"
      placeholder="Blog Description"
      value={state.description}
      onChange={handleChange}
      style="w-full px-4 py-3 rounded-lg mt-0 border focus:border-blue-500 focus:bg-white focus:outline-none"
    />
    <button
      className="w-full font-bold text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 rounded-lg text-sm px-4 py-3 mt-0 text-center me-2 mb-2 shadow-lg"
      type="submit"
      disabled={isLoading}
    >
      {isLoading ? 'Submitting...' : 'Submit'}
    </button>
  </div>
</form>
    )
}