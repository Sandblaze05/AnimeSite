import React from "react";

const Card = ({ title, image, onClick }) => {
  return (
    <div className="relative w-44 h-68 mb-4 rounded-xl overflow-hidden backdrop-blur-xl 
                    transform transition duration-300 hover:scale-105 cursor-pointer group
                    shadow-lg shadow-[#ff3d7f]/30 hover:shadow-[#ff3d7f]/50
                    border border-[#ff3d7f]/20 bg-gradient-to-b from-[#1a0e2b]/60 to-[#290a4a]/60"
                    onClick={onClick}>
      {/* Anime Poster */}
      <img className="w-full h-full object-cover" src={image} alt={title} />

      {/* Expandable Overlay */}
      <div className="absolute bottom-0 w-full bg-gradient-to-t from-[#290a4a]/90 to-[#290a4a]/60 
                      text-white text-center transition-all duration-300 ease-in-out h-12 
                      group-hover:h-full group-hover:flex group-hover:items-center group-hover:justify-center">
        <h3 className="text-md font-semibold px-2 bg-gradient-to-r from-[#ff3d7f] to-[#ff7eb3] 
                      bg-clip-text text-transparent">{title}</h3>
      </div>
    </div>
  );
};

export default Card;