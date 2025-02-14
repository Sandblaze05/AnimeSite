import React from "react";

const TorrentLinks = ({ episodes }) => {
    if (!episodes || episodes.length === 0) {
      return <p className="text-center text-gray-400 mt-4">No torrents available.</p>;
    }
  
    return (
      <div className="mt-6">
        <h2 className="text-xl font-semibold text-white border-b border-[#ff3d7f]/40 pb-2">
          Watch Episodes
        </h2>
        <ul className="mt-4 space-y-3">
          {episodes.map((episode, index) => (
            <li
              key={index}
              className="p-4 bg-[#290a4a]/40 rounded-lg text-white shadow-md 
                         border border-[#ff3d7f]/20 flex flex-col md:flex-row items-center md:justify-between"
            >
              <span className="text-lg font-medium">{episode.title}</span>
              <a
                href={episode.links}
                className="px-4 py-2 mt-2 md:mt-0 bg-[#ff3d7f] text-white rounded-lg 
                           hover:bg-[#ff7eb3] transition-all text-sm"
              >
                🧲
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default TorrentLinks;
  