import React from "react";

const SkeletonDetailedCard = () => {
  return (
    <div className="relative w-70 h-[600px] p-4 mb-2 rounded-2xl shadow-lg shadow-[#ff3d7f]/20 
      bg-gradient-to-b from-[#1a0e2b]/60 to-[#290a4a]/60 border border-[#ff3d7f]/10 
      backdrop-blur-xl bg-opacity-20 animate-pulse">
      
      {/* Image Placeholder */}
      <div className="w-full h-100 rounded-xl bg-gray-700/50"></div>

      {/* Title Placeholder */}
      <div className="mt-2 h-[70px] w-3/4 bg-gray-600/50 rounded"></div>

      {/* Rating & Status Placeholder */}
      <div className="flex items-center justify-between mt-2">
        <div className="w-10 h-4 bg-gray-600/50 rounded"></div>
        <div className="w-14 h-4 bg-gray-600/50 rounded"></div>
      </div>

      {/* Genres Placeholder */}
      <div className="flex flex-wrap gap-2 mt-2 h-[20px]">
        <div className="w-12 h-4 bg-gray-600/50 rounded"></div>
        <div className="w-14 h-4 bg-gray-600/50 rounded"></div>
        <div className="w-10 h-4 bg-gray-600/50 rounded"></div>
      </div>

      {/* Season & Episodes Placeholder */}
      <div className="flex justify-between items-center mt-3">
        <div className="w-14 h-4 bg-gray-600/50 rounded"></div>
        <div className="w-16 h-4 bg-gray-600/50 rounded"></div>
      </div>
    </div>
  );
};

export default SkeletonDetailedCard;
