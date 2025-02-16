import React, { useEffect, useState } from "react";
import Card from "../components/card";
import Search from "../components/search";
import DetailedCard from "../components/detailedCard";
import SkeletonDetailedCard from "../skeletons/skeletonDetailedCard";
import SkeletonCard from "../skeletons/skeletonCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "react-use";

const API_BASE_URL = "https://api.jikan.moe/v4/";

const Home = () => {
  
  {/* top anime */}
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  {/* current anime */}
  const [currentAnime, setCurrentAnime] = useState([]);
  const [loadingCurrentAnime, setLoadingCurrentAnime] = useState(false);
  const [errorMessageCurrentAnime, setErrorMessageCurrentAnime] = useState("");

  {/* top movies */}
  const [topMovies, setTopMovies] = useState([]);
  const [loadingTopMovies, setLoadingTopMovies] = useState(false);
  const [errorMessageTopMovies, setErrorMessageTopMovies] = useState("");

  {/*Search*/}
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [queryResponse, setQueryResponse] = useState([]);
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 700, [searchTerm]);
  
  const navigate = useNavigate();

  const retryTimeout = (refreshCallback, retryCount=3, delay=1000) => {
    if(retryCount>0){
      retryCount-=1;
      console.warn(`Retrying... (${4-retryCount}/3)`);
      setTimeout(() => refreshCallback(), delay);
    }
  };

  const fetchQuery = async ( query='' ) => {
    try {
      if(query!=''){
        const res = await fetch(`${API_BASE_URL}anime?q=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error("Error in search");
        const s = await res.json();
        console.log(s);
        setQueryResponse(s.data || []);
      }
    } catch (error) {
      console.log(error.message || "Error in search");
    }
  };
  
  const fetchAnime = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}top/anime?sfw`);

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();

      if (data.error != null || data.status == 404) {
        setErrorMessage(data.error || "Failed to fetch data");
        setAnime([]);
        retryTimeout(fetchAnime);
      }

      setAnime(data.data || []);
    } catch (error) {
      setErrorMessage(error.message);
      setAnime([]);
      retryTimeout(fetchAnime);
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
      if (data1.error != null || data1.status == 404) {
        setErrorMessageCurrentAnime(data1.error || "Failed to fetch data");
        setCurrentAnime([]);
        retryTimeout(fetchCurrentAnime);
        return;
      }
      setCurrentAnime(data1.data || []);
    } catch (error) {
      setErrorMessageCurrentAnime(error.message);
      setCurrentAnime([]);
      retryTimeout(fetchCurrentAnime);
    } finally {
      setLoadingCurrentAnime(false);
    }
  };

  const fetchTopMovies = async () => {
    try {
      setLoadingTopMovies(true);
      const result1 = await fetch(`${API_BASE_URL}top/anime?type=movie&sfw`);
      if (!result1.ok) {
        throw new Error("Failed to fetch data");
      }
      const data2 = await result1.json();
      if (data2.error != null || data2.status == 404) {
        setErrorMessageTopMovies(data2.error || "Failed to fetch data");
        setTopMovies([]);
        retryTimeout(fetchTopMovies);
      }
      setTopMovies(data2.data || []);
    } catch (error) {
      setErrorMessageTopMovies(error.message);
      setTopMovies([]);
      retryTimeout(fetchTopMovies);
    } finally {
      setLoadingTopMovies(false);
    }
  };

  useEffect(() => {
    fetchAnime();
    fetchCurrentAnime();
    fetchTopMovies();
  }, []);

  useEffect(() => {
    fetchQuery(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <main>
      <div>
        <header
          className="sticky top-0 z-50 flex items-center justify-between p-4  
             bg-gradient-to-r from-[#1a0e2b]/30 via-[#290a4a]/30 to-[#6b2254]/30 
             shadow-md shadow-[#ff3d7f]/30 backdrop-blur-2xl bg-opacity-20 
             border-b border-[#ff3d7f]/20"
        >
          {/* Logo / Title */}
          <div className="flex items-center ">
            <span className="relative text-2xl font-bold bg-gradient-to-r from-[#ff758c] to-[#ff7eb3] bg-clip-text text-transparent">
              Anime
            </span>
            <span className="text-2xl text-white">Site</span>
          </div>

          {/* Search Bar */}
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} onClick={() => {if(searchTerm!='') navigate(`/search/${searchTerm}`)}}/>
        </header>

        {/* Current Anime */}
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
                        image={item.images.webp.large_image_url}
                        rating={item.score}
                        status={item.status}
                        genres={item.genres}
                        season={item.season}
                        episodes={item.episodes}
                        onClick={() => navigate(`/anime/${item.mal_id}`)}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

        {/* Top Anime */}
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
                        onClick={() => navigate(`/anime/${item.mal_id}`)}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

        {/* top movies */}
        <section className="relative p-4">
          <h3 className="text-2xl font-prompt">
            <span className="bg-gradient-to-r from-[#c9676d] to-[#e07f84] bg-clip-text text-transparent text-2xl font-bold">
              Top
            </span>
            Movies
          </h3>

          <div className="relative overflow-hidden">
            {/* Left scroll button */}
            <button
              onClick={() => {
                const container = document.querySelector(".top-movie-scroll");
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
                const container = document.querySelector(".top-movie-scroll");
                container.scrollBy({ left: 400, behavior: "smooth" });
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-40 bg-[#1a0e2b]/80 hover:bg-[#290a4a] p-2 rounded-l-xl 
         text-[#ff3d7f] shadow-lg shadow-[#ff3d7f]/30 hover:shadow-[#ff3d7f]/50 transition-all duration-300"
            >
              <ChevronRight size={24} />
            </button>

            <div className="top-movie-scroll overflow-x-auto scrollbar-hidden p-6">
              {loadingTopMovies ? (
                <ul className="flex gap-4 list-none p-2">
                  {[...Array(8)].map((_, index) => (
                    <li key={index} className="flex-shrink-0">
                      <SkeletonCard />
                    </li>
                  ))}
                </ul>
              ) : errorMessageTopMovies ? (
                <p className="text-red-500">{errorMessageTopMovies}</p>
              ) : (
                <ul className="flex gap-4 list-none p-2">
                  {topMovies.map((item) => (
                    <li key={item.mal_id} className="flex-shrink-0">
                      <Card
                        title={item.title}
                        image={item.images.webp.image_url}
                        onClick={() => navigate(`/anime/${item.mal_id}`)}
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

export default Home;
