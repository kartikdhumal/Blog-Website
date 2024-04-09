"use client"
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import ImageUpload from '../input/ImageUpload';
import Input from '../input/Input';
import { toast } from 'react-hot-toast';

interface BlogProps {
  name: string;
  sections?: {
    imageSrc: string;
    description: string;
    id: string;
    blogId: string;
  }[];
  blogId: string;
}

interface Section {
  imageSrc: string;
  description: string;
  id: string;
  blogId: string;
}

interface InitialStateProps {
  name: string;
  sections: Section[];
}

const initialState: InitialStateProps = {
  name: '',
  sections: [{ imageSrc: '', description: '', id: '', blogId: '' }],
};

export default function BlogId({ name, sections, blogId }: BlogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [state, setState] = useState(initialState);
  const [currentuser, setCurrentUser] = useState([]);

  useEffect(() => {
    async function fetchSections() {
      try {
        const response = await axios.get(`/api/sections`);
        setCurrentUser(response.data.currentUser);
      } catch (error) {
        console.error(error);
      }
    }
    fetchSections();
  }, []);

  useEffect(() => {
    if (currentuser === null) {
      router.push('/');
    }
  }, [currentuser]);


  useEffect(() => {
    setState({
      name: name || '',
      sections: sections || [],
    });
  }, [name, sections]);

  const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>, sectionIndex: number) => {
    const { name, value } = event.target;
    setState((prevState) => ({
      ...prevState,
      sections: prevState.sections.map((section, index) =>
        index === sectionIndex ? { ...section, [name]: value } : section
      ),
    }));
  };

  const handleImageUpload = (value: string, sectionIndex: number) => {
    setState((prevState) => ({
      ...prevState,
      sections: prevState.sections.map((section, index) =>
        index === sectionIndex ? { ...section, imageSrc: value } : section
      ),
    }) as InitialStateProps);
  };

  const onSubmit = (event: FormEvent) => {
    setIsLoading(true);
    event.preventDefault();
    const updatedSections = state.sections.filter((section) => section.imageSrc !== '' && section.description !== '');
    console.log('Updated sections:', updatedSections);
    if (state.name === '' || updatedSections.length === 0) {
      toast.error('Fill all data');
      setIsLoading(false);
      return;
    }
    axios
      .put(`/api/blogs/${blogId}`, { name: state.name, sections: updatedSections })
      .then(() => {
        toast.success('Updated Successfully');
        router.push('/');
        router.refresh();
      })
      .catch((err) => {
        console.log(err);
        toast.error('Error updating blog');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

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
        console.error(err);
        toast.error('Error deleting blog');
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  const addSection = () => {
    const newSection: Section = {
      imageSrc: '',
      description: '',
      id: '',
      blogId: blogId,
    };

    setState(prevState => ({
      ...prevState,
      sections: [...prevState.sections, newSection]
    }));
  };

  const removeSection = (indexToRemove: number) => {
    const updatedSections = state.sections.filter((_, index) => index !== indexToRemove);
    setState(prevState => ({
      ...prevState,
      sections: updatedSections
    }))
  };


  return (
    <form onSubmit={onSubmit} className="bg-[#001f50] border-1 border-[#001f50] mx-auto py-0 px-4 sm:px-8 lg:px-16 flex  items-center lg:flex-col sm:flex flex-col border-2 ">
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
              onChange={(e) => handleDescriptionChange(e as any, index)}
              className="w-full h-48 px-4 py-3 rounded-lg mt-0 border resize-none focus:border-blue-500 focus:bg-white focus:outline-none"
            ></textarea>

            {state.sections.length > 0 && (
              <div className="flex flex-row items-center w-full my-0 justify-evenly">
                <div
                  onClick={addSection}
                  className="text-white cursor-pointer w-full bg-gradient-to-r from-sky-300 via-sky-500 to-sky-400 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-100 dark:focus:ring-blue-200 rounded-lg text-sm px-4 py-2 font-bold text-center"
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
            )}

          </div>
        ))}
      </div>
      <button
        className="w-full mt-4 font-bold text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 rounded-lg text-sm px-4 py-2 text-center me-2 mb-2 shadow-lg"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? 'Updating...' : 'Update'}
      </button>
      <div
        onClick={(e) => onDelete(e as any)}
        className="text-white cursor-pointer w-full  mx-2 bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 rounded-lg text-sm px-4 py-2 font-bold text-center"
      >
        {isDeleting ? 'Deleting...' : 'Delete'}
      </div>
    </form>
  );
}
