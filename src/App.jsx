import React, { useEffect, useState } from "react";
import Card from "./components/card";
import DetailedCard from "./components/detailedCard";
import SkeletonDetailedCard from "./components/skeletonDetailedCard";
import SkeletonCard from "./components/skeletonCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const API_BASE_URL = "https://api.jikan.moe/v4/";

const App = () => {
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [currentAnime, setCurrentAnime] = useState([]);
  const [loadingCurrentAnime, setLoadingCurrentAnime] = useState(false);
  const [errorMessageCurrentAnime, setErrorMessageCurrentAnime] = useState("");

  const fetchAnime = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}top/anime?sfw`);

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      console.log(data);

      if (data.error != null || data.status == 404) {
        setErrorMessage(data.error || "Failed to fetch data");
        setAnime([]);
        return;
      }

      setAnime(data.data || []);
    } catch (error) {
      setErrorMessage(error.message);
      setAnime([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentAnime = async () => {
    try {
      setLoadingCurrentAnime(true);
      const result = await fetch(`${API_BASE_URL}seasons/now?sfw`);
      if (!result.ok) {
        throw new Error("Failed to fetch data");
      }
      const data1 = await result.json();
      console.log(data1);
      if (data1.error != null || data1.status == 404) {
        setErrorMessageCurrentAnime(data1.error || "Failed to fetch data");
        setCurrentAnime([]);
        return;
      }
      setCurrentAnime(data1.data || []);
    } catch (error) {
      setErrorMessageCurrentAnime(error.message);
      setCurrentAnime([]);
    } finally {
      setLoadingCurrentAnime(false);
    }
  };

  useEffect(() => {
    fetchAnime();
    fetchCurrentAnime();
  }, []);

  return (
    <main>
      <div>
        <header
          className="sticky top-0 z-50 flex items-center justify-center p-4  
                    bg-gradient-to-r from-[#1a0e2b]/30 via-[#290a4a]/30 to-[#6b2254]/30 
                    shadow-md shadow-[#ff3d7f]/30 
                    backdrop-blur-2xl bg-opacity-20 border-b border-[#ff3d7f]/20"
        >
          <span className="relative text-2xl font-bold bg-gradient-to-r from-[#ff758c] to-[#ff7eb3] bg-clip-text text-transparent">
            Anime
          </span>
          <span className="text-2xl text-white">Site</span>
        </header>

        <section className="relative p-4 z-30">
          <div className="relative overflow-hidden">
            {" "}
            {/* Left scroll button */}
            <button
              onClick={() => {
                const container = document.querySelector(".scroll-content");
                container.scrollBy({ left: -400, behavior: "smooth" });
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-40 bg-[#1a0e2b]/80 hover:bg-[#290a4a] p-2 rounded-r-xl 
            text-[#ff3d7f] shadow-lg shadow-[#ff3d7f]/30 hover:shadow-[#ff3d7f]/50 transition-all duration-300"
            >
              <ChevronLeft size={24} />
            </button>
            {/* Right scroll button */}
            <button
              onClick={() => {
                const container = document.querySelector(".scroll-content");
                container.scrollBy({ left: 400, behavior: "smooth" });
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-40 bg-[#1a0e2b]/80 hover:bg-[#290a4a] p-2 rounded-l-xl 
            text-[#ff3d7f] shadow-lg shadow-[#ff3d7f]/30 hover:shadow-[#ff3d7f]/50 transition-all duration-300"
            >
              <ChevronRight size={24} />
            </button>
            <div className="scroll-content overflow-x-auto scrollbar-hidden">
              {loadingCurrentAnime ? (
                <ul className="flex gap-4 list-none p-2">
                  {" "}
                  {[...Array(6)].map((_, index) => (
                    <li key={index} className="flex-shrink-0">
                      <SkeletonDetailedCard />
                    </li>
                  ))}
                </ul>
              ) : errorMessageCurrentAnime ? (
                <p className="text-red-500">{errorMessageCurrentAnime}</p>
              ) : (
                <ul className="flex gap-4 list-none p-2">
                  {" "}
                  {currentAnime.map((item) => (
                    <li key={item.mal_id} className="flex-shrink-0">
                      <DetailedCard
                        title={item.title}
                        image={item.images.webp.image_url}
                        rating={item.score}
                        status={item.status}
                        genres={item.genres}
                        season={item.season}
                        episodes={item.episodes}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

        <section className="relative p-4">
          <h3 className="text-2xl font-prompt">
            <span className="bg-gradient-to-r from-[#c9676d] to-[#e07f84] bg-clip-text text-transparent text-2xl font-bold">
              Top
            </span>
            Animes
          </h3>

          <div className="relative overflow-hidden">
            {/* Left scroll button */}
            <button
              onClick={() => {
                const container = document.querySelector(".top-anime-scroll");
                container.scrollBy({ left: -400, behavior: "smooth" });
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-40 bg-[#1a0e2b]/80 hover:bg-[#290a4a] p-2 rounded-r-xl 
         text-[#ff3d7f] shadow-lg shadow-[#ff3d7f]/30 hover:shadow-[#ff3d7f]/50 transition-all duration-300"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Right scroll button */}
            <button
              onClick={() => {
                const container = document.querySelector(".top-anime-scroll");
                container.scrollBy({ left: 400, behavior: "smooth" });
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-40 bg-[#1a0e2b]/80 hover:bg-[#290a4a] p-2 rounded-l-xl 
         text-[#ff3d7f] shadow-lg shadow-[#ff3d7f]/30 hover:shadow-[#ff3d7f]/50 transition-all duration-300"
            >
              <ChevronRight size={24} />
            </button>

            <div className="top-anime-scroll overflow-x-auto scrollbar-hidden p-6">
              {loading ? (
                <ul className="flex gap-4 list-none p-2">
                  {[...Array(8)].map((_, index) => (
                    <li key={index} className="flex-shrink-0">
                      <SkeletonCard />
                    </li>
                  ))}
                </ul>
              ) : errorMessage ? (
                <p className="text-red-500">{errorMessage}</p>
              ) : (
                <ul className="flex gap-4 list-none p-2">
                  {anime.map((item) => (
                    <li key={item.mal_id} className="flex-shrink-0">
                      <Card
                        title={item.title}
                        image={item.images.webp.image_url}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default App;
