import React, { useState, useEffect } from "react";
import Search from "../components/search";
import { useDebounce } from "react-use";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://anime-stream-backend.onrender.com";
// const API_BASE_URL = "http://localhost:3000";

const Stream = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [queryResponse, setQueryResponse] = useState([]);
  const [files, setFiles] = useState([]);
  const [videoSrc, setVideoSrc] = useState(null);
  const navigate = useNavigate();

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 700, [searchTerm]);

  // Retrieve magnet link from localStorage
  const link = localStorage.getItem("link");
  const episode = link ? JSON.parse(link) : null;
  const magnetLink = episode?.mag || "";

  useEffect(() => {
    console.log("Magnet Link:", magnetLink);
    if (magnetLink) fetchTorrentFiles(magnetLink);
  }, [magnetLink]);

  // Fetch available files from the torrent
  const fetchTorrentFiles = async (magnet) => {
    try {
      const encodedMagnet = encodeURIComponent(magnet);
      const res = await fetch(`${API_BASE_URL}/add/${encodedMagnet}`);
      if (!res.ok) throw new Error("Failed to fetch files");

      const data = await res.json();
      console.log("Files:", data.files);
      setFiles(data.files || []);
    } catch (error) {
      console.error("Error fetching torrent files:", error.message);
    }
  };

  // Stream selected file
  const streamVideo = (fileName) => {
    setVideoSrc(`${API_BASE_URL}/stream/${encodeURIComponent(fileName)}`);
  };

  useEffect(() => {
    fetchQuery(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  const fetchQuery = async (query = "") => {
    try {
      if (query !== "") {
        const res = await fetch(
          `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}`
        );
        if (!res.ok) throw new Error("Error in search");

        const s = await res.json();
        console.log(s);
        setQueryResponse(s.data || []);
      }
    } catch (error) {
      console.log(error.message || "Error in search");
    }
  };

  return (
    <main>
      <header
        className="sticky top-0 z-50 flex items-center justify-between p-4  
             bg-gradient-to-r from-[#1a0e2b]/30 via-[#290a4a]/30 to-[#6b2254]/30 
             shadow-md shadow-[#ff3d7f]/30 backdrop-blur-2xl bg-opacity-20 
             border-b border-[#ff3d7f]/20"
      >
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <span className="relative text-2xl font-bold bg-gradient-to-r from-[#ff758c] to-[#ff7eb3] bg-clip-text text-transparent">
            Anime
          </span>
          <span className="text-2xl text-white">Stream</span>
        </div>

        <Search
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onClick={() => {
            if (searchTerm !== "") navigate(`/search/${searchTerm}`);
          }}
        />
      </header>

      <div className="p-4">
        <h2 className="text-xl font-bold">Available Files</h2>
        <ul>
          {files.map((file, index) => (
            <li key={index} className="mt-2">
              <button
                onClick={() => streamVideo(file.name)}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Play {file.name}
              </button>
            </li>
          ))}
        </ul>

        <h3 className="mt-4 font-semibold">Streaming:</h3>
        {videoSrc && (
          <video
            id="videoPlayer"
            controls
            className="w-4/5 max-w-3xl mt-2 border border-gray-400"
            src={videoSrc}
          />
        )}
      </div>
    </main>
  );
};

export default Stream;
