import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TorrentLinks = ({ episodes }) => {

  if (!episodes || !Array.isArray(episodes) || episodes.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-400 text-lg animate-pulse">No episodes available</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-white mb-6 relative">
        Watch Episodes
        <div className="absolute bottom-0 left-0 w-1/4 h-1 bg-gradient-to-r from-[#ff3d7f] to-transparent"></div>
      </h2>
      <div className="grid gap-4">
        {episodes.map((episode, index) => (
          <EpisodeCard
            key={episode.title}
            title={episode.title}
            links={episode.links}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

const EpisodeCard = ({ title, links, index }) => {
  const [showLinks, setShowLinks] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  // useEffect(() => {
  //   links.map((link) => {
  //     console.log(link);
  //   })
  // })

  const animationStyle = {
    opacity: 0,
    animation: `${0.5 + index * 0.1}s ease-out forwards fadeSlideIn`,
  };

  return (
    <div
      style={animationStyle}
      className={`bg-gradient-to-r from-[#290a4a]/80 to-[#290a4a]/40 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#ff3d7f]/20 ${
        showLinks ? 'scale-102' : 'scale-100'
      }`}
    >
      <div
        className="p-6 cursor-pointer"
        onClick={() => setShowLinks(!showLinks)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 rounded-full bg-[#ff3d7f]/20 flex items-center justify-center">
              <span className="text-[#ff3d7f] text-sm font-medium">
                {(index + 1).toString().padStart(2, '0')}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-white transition-colors duration-300">
              {title}
            </h3>
          </div>
          <div className={`transform transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}>
            {showLinks ? (
              <ChevronUp className="w-6 h-6 text-[#ff3d7f]" />
            ) : (
              <ChevronDown className="w-6 h-6 text-[#ff3d7f]" />
            )}
          </div>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          showLinks ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {links && Array.isArray(links) && (
          <div className="p-6 pt-0 space-y-3">
            {links.map((link, idx) => (
              <a
                key={idx}
                onClick={() => {
                  const j = {mag: link};
                  localStorage.setItem("link", JSON.stringify(j));
                  navigate(`/stream/${title}`);
                }}
                className="group flex items-center space-x-2 p-3 rounded-lg bg-[#ff3d7f]/10 hover:bg-[#ff3d7f]/20 transition-all duration-300 cursor-pointer"
              >
                <Download className="w-5 h-5 text-[#ff3d7f] group-hover:scale-110 transition-transform duration-300" />
                <span className="text-white text-sm group-hover:text-[#ff3d7f] transition-colors duration-300">
                  {link.text || `Link ${idx + 1}`}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Add keyframes animation to the document head
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeSlideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);

export default TorrentLinks;