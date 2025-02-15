import React from 'react'

const LoadMore = ({ onClick, loading }) => {
  return (
    <div className="flex justify-center mt-6">
      <button
        onClick={onClick}
        disabled={loading}
        className="px-6 py-2 text-white bg-gradient-to-r from-[#ff758c] to-[#ff7eb3] 
                   rounded-lg shadow-md transition-all duration-200 
                   hover:shadow-lg hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Loading..." : "Load More"}
      </button>
    </div>
  )
}

export default LoadMore