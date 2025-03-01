import React, { useEffect } from "react";
import { useState } from "react";
import { useDebounce } from "react-use";
import Search from "../components/search";
import Card from "../components/card";
import SkeletonCard from "../skeletons/skeletonCard";
import { useNavigate, useParams } from "react-router-dom";
import LoadMore from "../components/loadMore";

const API_BASE_URL = "https://api.jikan.moe/v4/";

const SearchResult = () => {
  const { query } = useParams();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [queryResponse, setQueryResponse] = useState([]);
  const [loadingContent, setloadingContent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [pageCount, setPageCount] = useState({ last: 0, current: 0 });
  
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 700, [searchTerm]);

  const fetchQuery = async (q = "", page = 1, shouldReset = true) => {
    try {
      if (q !== "") {
        setloadingContent(true);
        setErrorMessage(""); // Clear any previous errors
        
        // Reset results if this is a new search
        if (shouldReset) {
          setQueryResponse([]);
        }

        const res = await fetch(
          `${API_BASE_URL}anime?q=${encodeURIComponent(q)}&page=${page}`
        );
        
        if (!res.ok) {
          throw new Error("Error in search");
        }
        
        const s = await res.json();
        if (s.error || s.status === 404) {
          throw new Error(s.error || "Error in search");
        }

        setQueryResponse(prev => shouldReset ? s.data : [...prev, ...s.data]);
        setPageCount({
          last: s.pagination.last_visible_page,
          current: s.pagination.current_page
        });
      }
    } catch (error) {
      setErrorMessage(error.message || "Error in search");
      if (shouldReset) {
        setQueryResponse([]);
      }
    } finally {
      setloadingContent(false);
    }
  };

  // Effect for URL query parameter changes
  useEffect(() => {
    if (query) {
      setSearchTerm(query); // Update search input to match URL
      fetchQuery(query, 1, true); // Reset and fetch new results
    }
  }, [query]);

  const handleSearch = () => {
    if (searchTerm !== "") {
      navigate(`/search/${searchTerm}`);
    }
  };

  return (
    <main>
      <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-gradient-to-r from-[#1a0e2b]/30 via-[#290a4a]/30 to-[#6b2254]/30 shadow-md shadow-[#ff3d7f]/30 backdrop-blur-2xl bg-opacity-20 border-b border-[#ff3d7f]/20">
        <div className="flex items-center cursor-pointer" onClick={() => navigate(`/`)}>
          <span className="relative text-2xl font-bold bg-gradient-to-r from-[#ff758c] to-[#ff7eb3] bg-clip-text text-transparent">
            Anime
          </span>
          <span className="text-2xl text-white">Search</span>
        </div>

        <Search
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onClick={handleSearch}
        />
      </header>

      <section className="relative p-4">
        <h3 className="text-2xl font-prompt">
          <span className="bg-gradient-to-r from-[#c9676d] to-[#e07f84] bg-clip-text text-transparent text-2xl font-bold">
            {query}
          </span>
          {" | Results"}
        </h3>

        <div className="relative overflow-hidden">
          <div className="p-6">
            {loadingContent && queryResponse.length === 0 ? (
              <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 gap-y-6 list-none">
                {[...Array(15)].map((_, index) => (
                  <li key={index}>
                    <SkeletonCard />
                  </li>
                ))}
              </ul>
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 gap-y-6 list-none">
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
        
        {pageCount.current < pageCount.last && (
          <LoadMore 
            onClick={() => fetchQuery(query, pageCount.current + 1, false)} 
            loading={loadingContent} 
          />
        )}
      </section>
    </main>
  );
};

export default SearchResult;