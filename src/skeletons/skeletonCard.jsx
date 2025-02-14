import React from "react";

const SkeletonCard = () => {
  return (
    <div className="relative w-44 h-68 mb-4 rounded-xl overflow-hidden backdrop-blur-xl 
                    shadow-lg shadow-[#ff3d7f]/20 border border-[#ff3d7f]/10 
                    bg-gradient-to-b from-[#1a0e2b]/60 to-[#290a4a]/60 animate-pulse">
      
      {/* Placeholder for Image */}
      <div className="w-full h-full bg-[#2b1b3d]/60"></div>

      {/* Placeholder for Overlay Title */}
      <div className="absolute bottom-0 w-full h-12 bg-gradient-to-t from-[#290a4a]/90 to-[#290a4a]/60"></div>
    </div>
  );
};

export default SkeletonCard;
