import React from "react";

const Search = ({ searchTerm, setSearchTerm, onClick }) => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search anime..."
        className="w-48 md:w-64 lg:w-80 px-4 py-2 rounded-full text-white 
                 bg-white/10 backdrop-blur-lg border border-white/20 
                 focus:outline-none focus:ring-2 focus:ring-[#ff7eb3] transition" 
                 value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button className="absolute right-3 top-1/2 transform -translate-y-1/2" onClick={onClick}>
        🔍
      </button>
    </div>
  );
};

export default Search;
