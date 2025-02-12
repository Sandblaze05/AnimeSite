import React from "react";

const Card = ({ title, image }) => {
  return (
    <div className="relative w-44 rounded-xl overflow-hidden backdrop-blur-lg transform transition duration-300 hover:scale-105 hover:brightness-110 cursor-pointer">
      {/* Anime Poster */}
      <img className="w-full h-60 object-cover" src={image} alt={title} />

      {/* Overlay for Title */}
      <div className="bottom-0 w-full bg-black/60 text-white text-center py-2">
        <h3 className="text-md font-semibold">{title}</h3>
      </div>
    </div>
  );
};

export default Card;
