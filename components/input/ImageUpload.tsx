import React from 'react'

import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'
import { useCallback } from 'react'
import { TbPhotoPlus } from 'react-icons/tb'

declare global {
    var cloudinary: any;
}

interface ImageUploadProps {
    onChange: (value: string) => void
    value: string
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    onChange,
    value
}) => {


    const handleUpload = useCallback((result: any) => {
        onChange(result.info.secure_url)
    }, [onChange])

    return (
        <CldUploadWidget
            onUpload={handleUpload}
            uploadPreset='fn4yyw2l'
            options={{
                maxFiles: 1
            }}
        >

            {({ open }) => {
                return (
                    <div onClick={() => open?.()} className='lg:w-[375px] bg-[#375E97] rounded-2xl text-white sm:w-full my-5 relative cursor-pointer border-solid border-2 selection: border-black hover:opacity-70 flex flex-col justify-center p-7 items-center lg:h-52 sm:h-52'>
                        <TbPhotoPlus size='30px' />
                        <div className='text-md font-bold'>
                            Upload Blog Image
                        </div>

                        {value && (
                            <div className='absolute inset-0 w-full h-full '>
                                <Image alt='upload' fill style={{ objectFit: 'cover' }} src={value} />
                            </div>
                        )}
                    </div>
                )
            }}

        </CldUploadWidget>
    )
}

export default ImageUpload