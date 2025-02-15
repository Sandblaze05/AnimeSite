import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TorrentLinks from "../components/torrentLinks";
import Search from "../components/search";
import LoadMore from "../components/loadMore";
import { useDebounce } from "react-use";
import loadingGif from "../assets/miku-loading.gif"

const API_BASE_URL = "https://api.jikan.moe/v4";

const AnimeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [episodes, setEpisodes] = useState([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(true);
  const [errorEpisodes, setErrorEpisodes] = useState("");

  const [torrentReady, setTorrentReady] = useState(false);
  const [torrentLinks, setTorrentLinks] = useState([]);
  const videoRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [queryResponse, setQueryResponse] = useState([]);
  const [pageCount, setPageCount] = useState([]);

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 700, [searchTerm]);

  const fetchQuery = async (query = "") => {
    try {
      if (query != "") {
        const res = await fetch(
          `${API_BASE_URL}/anime?q=${encodeURIComponent(query)}`
        );
        if (!res.ok) throw new Error("Error in search");
        const s = await res.json();
        console.log(s);
        setQueryResponse(s);
      }
    } catch (error) {
      console.log(error.message || "Error in search");
    }
  };

  useEffect(() => {
    fetchQuery(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/anime/${id}/full`);
        if (!response.ok) throw new Error("Anime not found");

        const data = await response.json();
        if (data.error) throw new Error(data.error);
        console.log(data.data);
        setAnime(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnime();
  }, [id]);

  useEffect(() => {
    if (!anime?.title) return;
    let isCancelled = false;
    const fetchEpisodes = async () => {
      try {
        const response = await fetch(
          `https://anime-backend-psi.vercel.app/search?q=${anime?.title}`
        );
        const data1 = await response.json();
        if (data1.error) throw new Error(data1.error);
        if (!isCancelled) {
          const formattedEpisodes = data1.map((ep) => ({
            title: ep.title || `${anime?.title}`,
            links: ep.links[0].href || [],
          }));
          setEpisodes(formattedEpisodes);
          console.log(formattedEpisodes);
        }
      } catch (err) {
        if (!isCancelled) setError(err.message);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchEpisodes();

    return () => {
      isCancelled = true;
    };
  }, [anime?.title]);

  const playTorrent = (magnet) => {
    if (!window.WebTorrent) {
      console.error("WebTorrent not found");
      return;
    }

    const client = new WebTorrent();
    client.add(magnet, (torrent) => {
      console.log("Torrent added:", torrent);
      const file = torrent.files.find(
        (file) => file.name.endsWith(".mp4") || file.name.endsWith(".mkv")
      );

      if (file) {
        console.log("File found:", file);
        file.renderTo(videoRef.current, { autoplay: true });
        setTorrentReady(true);
      }
    });
  };

  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!anime) return null;

  return (
    <main className="w-full">
      {/* Header */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between p-4  
             bg-gradient-to-r from-[#1a0e2b]/30 via-[#290a4a]/30 to-[#6b2254]/30 
             shadow-md shadow-[#ff3d7f]/30 backdrop-blur-2xl bg-opacity-20 
             border-b border-[#ff3d7f]/20"
      >
        {/* Logo / Title */}
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <span className="relative text-2xl font-bold bg-gradient-to-r from-[#ff758c] to-[#ff7eb3] bg-clip-text text-transparent">
            Anime
          </span>
          <span className="text-2xl text-white">Details</span>
        </div>

        {/* Search Bar */}
        <Search
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onClick={() => {
            if (searchTerm != "") navigate(`/search/${searchTerm}`);
          }}
        />
      </header>

      {loading ? (
        <div className="flex items-center justify-center h-[70vh]">
          <img src={loadingGif} alt="Loading..." className="w-30 h-24" />
        </div>
      ) : (
        // Anime Content (Shown After Loading)
        <div
          className="max-w-5xl mx-auto bg-[#1a0e2b] p-4 md:p-6 rounded-xl shadow-lg shadow-[#ff3d7f]/30 
             border border-[#ff3d7f]/20 text-white mt-4 md:mt-6"
        >
          {/* Anime Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-[#ff3d7f] to-[#ff7eb3] bg-clip-text text-transparent">
            {anime?.title_english || anime?.title || "Title Not Available"}
          </h1>

          {/* Image + Info */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 mt-4 md:mt-6">
            {/* Anime Image */}
            <img
              className="w-full md:w-72 rounded-lg shadow-lg"
              src={anime?.images?.webp?.large_image_url || "placeholder.jpg"}
              alt={anime?.title || "Anime Image"}
            />

            {/* Anime Details */}
            <div className="flex flex-col justify-between">
              <p className="text-gray-300 text-sm md:text-base">
                {anime?.synopsis || "Synopsis not available."}
              </p>

              {/* Extra Details */}
              <div className="mt-3 md:mt-4 text-gray-400 text-sm md:text-base">
                <p>
                  <strong>Episodes:</strong> {anime?.episodes || "N/A"}
                </p>
                <p>
                  <strong>Status:</strong> {anime?.status}
                </p>
                <p>
                  <strong>Season:</strong> {anime?.season} {anime?.year}
                </p>
                <p>
                  <strong>Rating:</strong> {anime?.rating}
                </p>
                <p>
                  <strong>Score:</strong> ⭐ {anime?.score}
                </p>
              </div>

              {/* Genres */}
              <div className="mt-3 md:mt-4 flex flex-wrap gap-2">
                {anime?.genres?.map((genre) => (
                  <span
                    key={genre.mal_id}
                    className="px-2 py-1 text-xs md:text-sm rounded-lg bg-[#ff3d7f]/20 text-[#ff7eb3]"
                  >
                    {genre.name}
                  </span>
                )) || <p>No genres available.</p>}
              </div>
            </div>
          </div>

          {/* Trailer */}
          {anime?.trailer?.embed_url && (
            <div className="mt-4 md:mt-6">
              <h2 className="text-lg md:text-xl font-semibold">Trailer</h2>
              <iframe
                className="w-full h-52 md:h-80 mt-2 rounded-lg"
                src={anime.trailer.embed_url}
                title="Trailer"
                allow="autoplay; encrypted-media; picture-in-picture"
                sandbox="allow-scripts allow-same-origin allow-presentation"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
      )}

      {/* Torrent Links */}
      <div className="p-4 md:p-6">
        <TorrentLinks episodes={episodes} />
      </div>
    </main>
  );
};

export default AnimeDetails;
