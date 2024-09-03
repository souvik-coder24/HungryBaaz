import React from 'react';
import { ShimmerPostDetails } from 'react-shimmer-effects';

const ShimmerMenu = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center pt-16">
      <div className="w-[70%] flex flex-col justify-center items-center">
        <div className="w-full">
          <ShimmerPostDetails card cta variant="SIMPLE" />
        </div>
      </div>
    </div>
  );
};

export default ShimmerMenu;