'use client'
import React, { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import Input from '@/components/input/Input'
import ImageUpload from '@/components/input/ImageUpload'

interface InitialStateProps {
  name?: string;
  sections: {
    imageSrc: string;
    description: string;
  }[];
}

interface Section {
  id: string;
  imageSrc: string;
  description: string;
  blogId: string;
}

const initialState: InitialStateProps = {
  name: '',
  sections: [{ imageSrc: '', description: '' }]
};

export default function page() {
  const [state, setState] = useState(initialState)
  const [isLoading, setIsLoading] = useState(false)
  const [sections, setSections] = useState<Section[]>([]);
  const router = useRouter()
  // const [currentuser, setCurrentUser] = useState([]);

  // useEffect(() => {
  //   async function fetchSections() {
  //     try {
  //       const response = await axios.get(`/api/sections`);
  //       setCurrentUser(response.data.currentUser);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  //   fetchSections();
  // }, []);

  // useEffect(() => {
  //   if (currentuser === null) {
  //     console.log("Yes");
  //   }
  //   else{
  //     console.log(currentuser);
  //   }
  // }, [currentuser]);

  const onSubmit = (event: FormEvent) => {
    setIsLoading(true);
    event.preventDefault();
    if (
      state.name === '' ||
      state.sections.some((section) => section.imageSrc === '' || section.description === '')
    ) {
      toast.error('Fill all data');
      setIsLoading(false);
    }
    else {
      axios
        .post('/api/blogs', state)
        .then(() => {
          toast.success('Created successfully');
          router.push('/');
          router.refresh();
        }).catch(error => {
          if (error.response) {
            toast.error(error.response.data);
          } else if (error.request) {
            toast.error('No response received from the server.');
          } else {
            toast.error('Error occurred while sending the request.');
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = event.target;
    setState(prevState => {
      const updatedSections = [...prevState.sections];
      updatedSections[index] = { ...updatedSections[index], [name]: value };
      return { ...prevState, sections: updatedSections };
    });
  };

  const handleImageUpload = (imageSrc: string, index: number) => {
    setState(prevState => {
      const updatedSections = [...prevState.sections];
      updatedSections[index].imageSrc = imageSrc;
      return { ...prevState, sections: updatedSections };
    });
  };

  const addSection = () => {
    setState(prevState => ({
      ...prevState,
      sections: [...prevState.sections, { imageSrc: '', description: '' }]
    }));
  };

  const removeSection = (indexToRemove: number) => {
    setState(prevState => ({
      ...prevState,
      sections: prevState.sections.filter((_, index) => index !== indexToRemove)
    }));
  };

  return (
    <form onSubmit={onSubmit} className="bg-[#001f50] mx-auto w-full py-0 px-4 border-2 border-[#001f50] sm:px-8 lg:px-16 flex  items-center lg:flex-col sm:flex flex-col">
      <div className='pt-12 w-full'>
        <Input
          type="text"
          name="name"
          id="name"
          placeholder="Title"
          value={state.name}
          onChange={(e) => setState({ ...state, name: e.target.value })}
          style="lg:w-96 sm:w-[100%] px-4 py-3 mt-5 rounded-lg  mt-2 border focus:border-blue-500 focus:outline-none"
        />
        {state.sections.map((section, index) => (
          <div key={index} className="flex items-start justify-start flex-col gap-4">
            <ImageUpload
              value={section.imageSrc}
              onChange={(value) => handleImageUpload(value, index)}
            />
            <textarea
              name="description"
              id={`description-${index}`}
              placeholder="Content"
              value={section.description}
              onChange={(e) => handleChange(e as any, index)}
              className="w-full h-48 px-4 py-3 rounded-lg mt-0 border resize-none focus:border-blue-500 focus:bg-white focus:outline-none"
            ></textarea>

            <div className="flex flex-row items-center w-full my-0 justify-evenly">
              <div
                onClick={addSection}
                className="text-white cursor-pointer w-full bg-gradient-to-r from-sky-400 via-sky-600 to-sky-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-200 dark:focus:ring-blue-300 rounded-lg text-sm px-4 py-2 font-bold text-center"
              >
                Add More
              </div>
              {state.sections.length > 1 && (
                <div
                  onClick={() => removeSection(index)}
                  className="text-white cursor-pointer w-full  mx-2 bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 rounded-lg text-sm px-4 py-2 font-bold text-center"
                >
                  Remove
                </div>
              )}
            </div>

          </div>
        ))}
      </div>
      <button
        className="w-full mt-4 font-bold text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 rounded-lg text-sm px-4 py-2 text-center me-2 mb-2 shadow-lg"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}