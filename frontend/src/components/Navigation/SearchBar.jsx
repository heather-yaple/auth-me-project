// src/components/SearchBar.jsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as setUserSpots from '../../store/spots.js'; // Adjust based on your actions file

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();

  // Handle the form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {  // Prevent search if the query is empty or only contains whitespace
      dispatch(setUserSpots.searchSpots(query));
    }
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Search cabins..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search cabins"
      />
      <button type="submit" disabled={!query.trim()} aria-label="Search button">
        Search
      </button>
    </form>
  );
};

export default SearchBar;

