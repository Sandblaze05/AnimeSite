import React, { useEffect, useState } from "react";
import Card from "./components/card";
import DetailedCard from "./components/detailedCard";

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

      if (data.error!=null || data.status == 404) {
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
      if (data1.error!=null || data1.status == 404) {
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
          <div className="relative flex flex-wrap justify-left gap-6 p-6 overflow-x-auto">
            {loadingCurrentAnime ? (
              <p>loading</p>
            ) : errorMessageCurrentAnime ? (
              <p className="text-red-500">{errorMessageCurrentAnime}</p>
            ) : (
              <ul className="flex gap-4 list-none p-2 sm:overflow-x-auto scrollbar-hidden">
                {currentAnime.map((item) => (
                  <li key={item.mal_id}>
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
        </section>

        <section className="relative p-4">
          <h3 className="text-2xl font-prompt">
            <span className="bg-gradient-to-r from-[#c9676d] to-[#e07f84] bg-clip-text text-transparent text-2xl font-bold">
              Top
            </span>
            Animes
          </h3>
          <div className="relative flex flex-wrap justify-left gap-6 p-6 overflow-x-auto">
            {loading ? (
              <p>loading</p>
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul className="flex gap-4 list-none p-2 sm:overflow-x-auto scrollbar-hidden">
                {anime.map((item) => (
                  <li key={item.mal_id}>
                    <Card
                      title={item.title}
                      image={item.images.webp.image_url}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default App;
