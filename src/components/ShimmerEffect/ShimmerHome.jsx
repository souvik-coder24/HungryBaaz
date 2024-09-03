import React from 'react';
import { MdFastfood } from 'react-icons/md';
import { ShimmerCircularImage, ShimmerSimpleGallery, ShimmerText } from 'react-shimmer-effects';

const ShimmerHome = () => {
  return (
    <div className="w-full pt-16 px-4 sm:px-6 lg:px-8">
      {/*Header*/}
      <div className="w-full h-[350px] rounded-2xl bg-gray-800 text-white flex flex-col gap-5 items-center justify-center">
        <div className='relative flex items-start'>
          <MdFastfood size={60} className="mt-2 ml-3 absolute" />
          <span className="loader"></span>
        </div>
        <h1 className="text-md text-center px-4 md:px-6 lg:px-8">
          Uncover the best food experiences close to your place......
        </h1>
      </div>
      
      {/*Gallery*/}
      <div className='mt-8 mx-auto max-w-7xl'>
        <div className="w-full sm:w-[80%] lg:w-[60%] mx-auto">
          <div className="mb-6 text-center">
            <ShimmerText line={1} width={30} />
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex-shrink-0">
                <ShimmerCircularImage size={130} />
              </div>
            ))}
          </div>
          <div className="mt-6">
            <ShimmerSimpleGallery card imageHeight={200} col={2} caption />
          </div>
          <div className="mt-6 text-center">
            <ShimmerText line={1} width={30} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShimmerHome;