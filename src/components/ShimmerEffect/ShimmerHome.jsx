import React from 'react';
import { MdFastfood } from 'react-icons/md';
import { ShimmerCircularImage, ShimmerSimpleGallery, ShimmerText } from 'react-shimmer-effects';

const ShimmerHome = () => {
  return (
    <div className="w-full pt-16">
      <div className="w-full h-[350px] rounded-2xl bg-gray-800 text-white flex flex-col gap-5 items-center justify-center">
        <div className='relative flex items-start'>
            <MdFastfood size={60} className="mt-2 ml-3 absolute" />
            <span class="loader "></span>
        </div>
        <h1 className="text-md">Uncover the best food experiences close to your place......</h1>
      </div>
      
      <div className=' mt-8 w-[80%] mx-auto'>
        <div className="w-[30%] ml-12">
            <ShimmerText line={1} width={20}/>
        </div>
        <div className="flex justify-center gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
            <div key={index}>
                <ShimmerCircularImage size={130} />
            </div>
            ))}
        </div>
        <ShimmerSimpleGallery card imageHeight={200} col={4} caption />
        <div className="w-[20%] ml-12">
            <ShimmerText line={1} width={20}/>
        </div>
      </div>
    </div>
  );
};

export default ShimmerHome;