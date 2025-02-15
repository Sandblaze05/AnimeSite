import React, { useEffect } from "react";
import { useState } from "react";
import { useDebounce } from "react-use";
import Search from "../components/search";
import Card from "../components/card";
import SkeletonCard from "../skeletons/skeletonCard";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE_URL = "https://api.jikan.moe/v4/";

const SearchResult = () => {
  const { query } = useParams();
  const navigate = useNavigate();

  {
    /*Search*/
  }
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [queryResponse, setQueryResponse] = useState([]);
  const [loadingConent, setLoadingConent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 700, [searchTerm]);

  const fetchQuery = async (q = "") => {
    try {
      if (q != "") {
        setLoadingConent(true);
        const res = await fetch(
          `${API_BASE_URL}anime?q=${encodeURIComponent(q)}`
        );
        if (!res.ok) {
          setErrorMessage("Error in search");
          throw new Error("Error in search");
        }
        const s = await res.json();
        if (s.error || s.status == 404) {
          setErrorMessage(s.error || "Error in search");
          setQueryResponse([]);
        }
        console.log(s);
        setQueryResponse(s.data);
      }
    } catch (error) {
      setErrorMessage(error);
      console.log(error.message || "Error in search");
    } finally {
      setLoadingConent(false);
    }
  };

  // useEffect(() => {
  //   fetchQuery(debouncedSearchTerm);
  // }, [debouncedSearchTerm]);

  useEffect(() => {
    console.log(query);
    fetchQuery(query);
  }, [query]);

  return (
    <main>
      <header
        className="sticky top-0 z-50 flex items-center justify-between p-4  
             bg-gradient-to-r from-[#1a0e2b]/30 via-[#290a4a]/30 to-[#6b2254]/30 
             shadow-md shadow-[#ff3d7f]/30 backdrop-blur-2xl bg-opacity-20 
             border-b border-[#ff3d7f]/20"
      >
        {/* Logo / Title */}
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate(`/`)}
        >
          <span className="relative text-2xl font-bold bg-gradient-to-r from-[#ff758c] to-[#ff7eb3] bg-clip-text text-transparent">
            Anime
          </span>
          <span className="text-2xl text-white">Search</span>
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

      <section className="relative p-4">
        <h3 className="text-2xl font-prompt">
          <span className="bg-gradient-to-r from-[#c9676d] to-[#e07f84] bg-clip-text text-transparent text-2xl font-bold">
            {query}
          </span>
          Results
        </h3>

        <div className="relative overflow-hidden">
          <div className="p-6">
            {loadingConent ? (
              <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 list-none p-2">
                {[...Array(8)].map((_, index) => (
                  <li key={index}>
                    <SkeletonCard />
                  </li>
                ))}
              </ul>
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 list-none p-2">
                {queryResponse.map((item) => (
                  <li key={item.mal_id}>
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
    </main>
  );
};

export default SearchResult;
