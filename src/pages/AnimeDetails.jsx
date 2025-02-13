import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_BASE_URL = "https://api.jikan.moe/v4";

const AnimeDetails = () => {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/anime/${id}/full`);
        if (!response.ok) throw new Error("Anime not found");

        const data = await response.json();
        if (data.error) throw new Error(data.error);

        setAnime(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [id]);

  if (loading) return <p className="text-center text-gray-400">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!anime) return null;

  return (
    <main className="">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-center p-4  
                         bg-gradient-to-r from-[#1a0e2b]/30 via-[#290a4a]/30 to-[#6b2254]/30 
                         shadow-md shadow-[#ff3d7f]/30 backdrop-blur-2xl border-b border-[#ff3d7f]/20">
        <span className="relative text-2xl font-bold bg-gradient-to-r from-[#ff758c] to-[#ff7eb3] bg-clip-text text-transparent">
          Anime
        </span>
        <span className="text-2xl text-white">Details</span>
      </header>

      {/* Anime Content */}
      <div className="max-w-5xl mx-auto bg-[#1a0e2b] p-6 rounded-xl shadow-lg shadow-[#ff3d7f]/30 
                      border border-[#ff3d7f]/20 text-white mt-6">
        
        {/* Anime Title */}
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-[#ff3d7f] to-[#ff7eb3] 
                       bg-clip-text text-transparent">
          {anime?.title_english || anime?.title || "Title Not Available"}
        </h1>

        {/* Image + Info */}
        <div className="flex flex-col md:flex-row gap-6 mt-6">
          {/* Anime Image */}
          <img
            className="w-full md:w-72 rounded-lg shadow-lg"
            src={anime?.images?.webp?.large_image_url || "placeholder.jpg"}
            alt={anime?.title || "Anime Image"}
          />

          {/* Anime Details */}
          <div className="flex flex-col justify-between">
            <p className="text-gray-300 text-sm">{anime?.synopsis || "Synopsis not available."}</p>

            {/* Extra Details */}
            <div className="mt-4 text-gray-400 text-sm">
              <p><strong>Episodes:</strong> {anime?.episodes || "N/A"}</p>
              <p><strong>Status:</strong> {anime?.status}</p>
              <p><strong>Season:</strong> {anime?.season} {anime?.year}</p>
              <p><strong>Rating:</strong> {anime?.rating}</p>
              <p><strong>Score:</strong> ⭐ {anime?.score}</p>
            </div>

            {/* Genres */}
            <div className="mt-4 flex flex-wrap gap-2">
              {anime?.genres?.map((genre) => (
                <span key={genre.mal_id} className="px-2 py-1 text-xs rounded-lg bg-[#ff3d7f]/20 text-[#ff7eb3]">
                  {genre.name}
                </span>
              )) || <p>No genres available.</p>}
            </div>
          </div>
        </div>

        {/* Trailer */}
        {anime?.trailer?.embed_url && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold">Trailer</h2>
            <iframe
              className="w-full h-100 mt-2 rounded-lg"
              src={anime.trailer.embed_url}
              title="Trailer"
              allow="autoplay; encrypted-media; picture-in-picture"
              sandbox="allow-scripts allow-same-origin allow-presentation"
              allowFullScreen
            ></iframe>
          </div>
        )}

        {/* Episodes (Dummy for now, you need to fetch separately) */}
        {/* {<div className="mt-6">
          <h2 className="text-xl font-semibold">Episodes</h2>
          <ul className="mt-2 space-y-2">
            {[...Array(10)].map((_, index) => (
              <li key={index} className="p-2 bg-[#290a4a]/40 rounded-lg text-sm text-gray-300">
                Episode {index + 1} - Coming Soon
              </li>
            ))}
          </ul>
        </div>} */}
      </div>
    </main>
  );
};

export default AnimeDetails;
