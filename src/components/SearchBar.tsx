import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pt-8 pb-4">
      <form onSubmit={handleSubmit} className="relative space-y-2 sm:space-y-0">
        {/* Search Input Container */}
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for luxury items..."
            className="w-full h-12 sm:h-14 px-5 pl-12 rounded-xl border-2 border-gray-200 bg-white text-base sm:text-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
          />
          <Search 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-purple-500 transition-colors" 
            size={24} 
          />
        </div>

        {/* Search Button - Full width on mobile, inline on desktop */}
        <button
          type="submit"
          className="w-full sm:w-auto sm:absolute sm:right-3 sm:top-1/2 sm:transform sm:-translate-y-1/2 
                   bg-purple-600 text-white px-6 py-3 sm:py-2 rounded-lg font-medium 
                   hover:bg-purple-700 focus:ring-2 focus:ring-purple-300 transition-all duration-200"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;