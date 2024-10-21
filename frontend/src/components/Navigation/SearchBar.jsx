// src/components/SearchBar.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as setUserSpots from '../../store/spots.js'; // Adjust based on your actions file

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const dispatch = useDispatch();

    const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setUserSpots.searchSpots(query));
};

    return (
        <form onSubmit={handleSearch}>
            <input
                type="text"
                placeholder="Search cabins..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit">Search</button>
        </form>
    );
};

export default SearchBar;
