'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import Image from 'next/image';
import ImageUpload from '../input/ImageUpload';
import Input from '../input/Input';
import { toast } from 'react-hot-toast';

interface BlogProps {
  name?: string;
  description?: string;
  imageSrc?: any;
  blogId?: string;
}

interface InitialStateProps {
  name: string;
  description: string;
  imageSrc: string;
}

const initialState: InitialStateProps = {
  name: '',
  description: '',
  imageSrc: '',
};

export default function BlogId({ name, description, imageSrc, blogId }: BlogProps) {
  const router = useRouter();
  const [onActive, setOnActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [state, setState] = useState(initialState);

  useEffect(() => {
    setState({
      name: name || '',
      description: description || '',
      imageSrc: imageSrc || '',
    });
  }, [name, description, imageSrc]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setState({ ...state, [event.target.name]: event.target.value });
  }

  const onSubmit = (event: FormEvent) => {
    setIsLoading(true);
    event.preventDefault();
    if (state.name == '' || state.imageSrc == '' || state.description == '') {
      toast.error('Fill the data');
      setIsLoading(false);
    }{
      axios.put(`/api/blogs/${blogId}`, state)
      .then(() => {
        toast.success('Updated Successfully');
        router.refresh();
        router.push('/');
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
    }
  };
// for delete blog
  const onDelete = (event: FormEvent) => {
    setIsDeleting(true);
    event.preventDefault();
    axios
      .delete(`/api/blogs/${blogId}`)
      .then(() => {
        toast.success('Deleted Successfully');
        router.push('/');
        router.refresh();
      })
      .catch((err) => {
        throw new Error(err);
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  const setCustomValue = (id: any, value: any) => {
    setState((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  return (
    <div className="lg:w-screen overflow-hidden justify-center items-center lg:h-screen sm:h-auto sm:w-full mx-auto py-16 bg-gradient-to-t from-blue-500 via-blue-600 to-blue-700">
  <div className="mybox flex flex-col justify-center items-center p-5">

    <form onSubmit={onSubmit} className="w-full max-w-[400px] mx-auto">
      <div className="mb-4">
        <ImageUpload value={state.imageSrc} onChange={(value) => setCustomValue('imageSrc', value)} />
      </div>
      <div className="flex flex-col justify-center py-8 gap-2">
        <Input
          type="text"
          name="name"
          id="name"
          placeholder="Name"
          value={state.name}
          onChange={handleChange}
          style="w-full px-4 py-3 font-bold rounded-lg border focus:border-blue-500 focus:bg-white focus:outline-none"
        />
        <Input
          type="text"
          name="description"
          id="description"
          placeholder="Description"
          value={state.description}
          onChange={handleChange}
          style="w-full px-4 py-3 rounded-lg border focus:border-blue-500 focus:bg-white focus:outline-none"
        />
        <div className='flex lg:flex-row gap-3'>
          <button
            type="submit"
            className="w-full text-white font-bold bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 rounded-lg text-md px-4 py-2 mt-2 border border-solid border-green-700 shadow-md"
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update'}
          </button>
          <button
            disabled={isDeleting}
            className="w-full mt-2 text-white font-bold bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 rounded-lg text-md px-4 py-2 border border-solid border-red-700 shadow-md"
            onClick={onDelete}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </form>
  </div>
</div>
  );
}
