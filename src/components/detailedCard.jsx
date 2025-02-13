import React from "react";

const DetailedCard = ({
  title,
  image,
  rating,
  status,
  genres,
  season,
  episodes,
}) => {
    // console.log(title.length);
  return (
    <div
      className="relative w-70 h-[600px] p-4 mb-2 rounded-2xl shadow-lg shadow-[#ff3d7f]/30 
      bg-gradient-to-b from-[#1a0e2b]/60 to-[#290a4a]/60 border border-[#ff3d7f]/20 
      backdrop-blur-xl bg-opacity-20 hover:shadow-[#ff3d7f]/50 transition-all duration-300 flex flex-col"
    >
      {/* Anime Poster */}
      <div className="w-full h-100 overflow-hidden rounded-xl">
        <img
          className="w-full h-full object-cover transform transition duration-300 hover:scale-105"
          src={image}
          alt={title}
        />
      </div>

      {/* Title */}
      <h3
        className={`mt-2 h-[70px] text-lg font-bold bg-gradient-to-r from-[#ff3d7f] to-[#ff7eb3] bg-clip-text text-transparent text-center line-clamp-2 overflow-hidden leading-tight ${
          title.length > 30 ? "text-md" : ""
        }`}
      >
        {title}
      </h3>

      {/* Rating & Status */}
      <div className="flex items-center justify-between mt-2 text-sm text-gray-300">
        <span className="flex items-center gap-1">⭐ {rating || "N/A"}</span>
        <span
          className={`px-2 py-1 text-xs rounded-lg ${
            status === "Ongoing"
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {status || "Unknown"}
        </span>
      </div>

      {/* Genres */}
      <div className="flex flex-wrap gap-2 mt-2 overflow-hidden h-[20px]">
        {genres?.length > 0 ? (
          genres.map((genre) => (
            <span
              key={genre.mal_id}
              className="px-3 py-[2px] text-xs rounded-md bg-[#ff3d7f]/20 text-[#ff7eb3] whitespace-nowrap min-w-[50px]"
            >
              {genre.name}
            </span>
          ))
        ) : (
          <span className="text-xs text-gray-500">No Genres</span>
        )}
      </div>

      {/* Season & Episodes */}
      <div className="flex justify-between items-center mt-auto text-sm text-gray-400">
        <span>📅 {season || "N/A"}</span>
        <span>🎞️ {episodes ? `${episodes} eps` : "Unknown"}</span>
      </div>
    </div>
  );
};

export default DetailedCard;
