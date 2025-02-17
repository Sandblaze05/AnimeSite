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
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [currentTorrent, setCurrentTorrent] = useState(null); 
  const navigate = useNavigate();

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 700, [searchTerm]);

  // Retrieve magnet link from localStorage
  const link = localStorage.getItem("link");
  const episode = link ? JSON.parse(link) : null;
  const magnetLink = episode?.mag || "";

  useEffect(() => {
    const fetchFiles = async () => {
      if (magnetLink) {
        try {
          setLoadingFiles(true);
          await fetchTorrentFiles(magnetLink);
        } catch (error) {
          console.error("Error in useEffect:", error);
        } finally {
          setLoadingFiles(false);
        }
      }
    };
  
    fetchFiles();
  }, [magnetLink]);

  // Fetch available files from the torrent
  const fetchTorrentFiles = async (magnet) => {
    try {
      setLoadingFiles(true);
      const encodedMagnet = encodeURIComponent(magnet);
      const res = await fetch(`${API_BASE_URL}/add/${encodedMagnet}`);
      
      if (!res.ok) {
        throw new Error(`Failed to fetch files: ${res.status}`);
      }

      const data = await res.json();
      console.log("Torrent data:", data);

      // Extract infoHash from magnet link
      const infoHashMatch = magnet.match(/xt=urn:btih:([^&]+)/);
      if (!infoHashMatch) {
        throw new Error("Invalid magnet link - no infohash found");
      }

      const infoHash = infoHashMatch[1].toLowerCase();
      setCurrentTorrent({ infoHash, files: data.files || [] });
      setFiles(data.files || []);
    } catch (error) {
      console.error("Error fetching torrent files:", error);
    } finally {
      setLoadingFiles(false);
    }
  };

  // Stream selected file
  const streamVideo = async (fileName) => {
    if (!currentTorrent?.infoHash) {
      console.error("No torrent info available");
      return;
    }
  
    try {
      // First check if the torrent is ready
      const checkResponse = await fetch(`${API_BASE_URL}/add/${encodeURIComponent(magnetLink)}`);
      if (!checkResponse.ok) {
        throw new Error("Torrent not ready");
      }
  
      const streamUrl = `${API_BASE_URL}/stream/${currentTorrent.infoHash}/${encodeURIComponent(fileName)}`;
      console.log("Attempting to stream:", {
        fileName,
        infoHash: currentTorrent.infoHash,
        url: streamUrl
      });
  
      setVideoSrc(streamUrl);
    } catch (error) {
      console.error("Error starting stream:", error);
      // Optionally show error to user
      setVideoSrc(null);
    }
  };

  useEffect(() => {
    fetchQuery(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    return () => {
      if (videoSrc) {
        setVideoSrc(null);
      }
    };
  }, []);

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
    <main className="min-h-screen bg-[#1a0e2b]">
      {/* Original Header Preserved Exactly */}
      <header className="sticky top-0 z-50 flex items-center justify-between p-4 w-full bg-gradient-to-r from-[#1a0e2b]/30 via-[#290a4a]/30 to-[#6b2254]/30 shadow-md shadow-[#ff3d7f]/30 backdrop-blur-2xl bg-opacity-20 border-b border-[#ff3d7f]/20">
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

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Video Player Section */}
        <div className="mb-8">
          <div className="relative aspect-video rounded-lg overflow-hidden border border-[#ff3d7f]/20 bg-[#290a4a]/20">
            {videoSrc ? (
              <video
                id="videoPlayer"
                controls
                className="w-full h-full object-contain"
                src={videoSrc}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-[#ff3d7f]/20 border-t-[#ff758c] rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* File List Section */}
        <div className="rounded-lg bg-[#290a4a]/10 border border-[#ff3d7f]/20 p-6">
          <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-[#ff758c] to-[#ff7eb3] bg-clip-text text-transparent">
            Available Episodes
          </h2>

          {loadingFiles ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-12 bg-[#290a4a]/20 animate-pulse rounded-lg"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {files.map((file, index) => (
                <button
                  key={index}
                  onClick={() => streamVideo(file.name)}
                  className="px-4 py-3 bg-[#290a4a]/20 hover:bg-[#ff3d7f]/10 border border-[#ff3d7f]/20 rounded-lg transition-colors text-left truncate text-white"
                >
                  Episode {index + 1}: {file.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Stream;
