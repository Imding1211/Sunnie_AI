import React, { useState } from 'react';
import { Search } from 'lucide-react';
import './SearchBar.css';

/**
 * SearchBar 搜尋列元件
 * 用於 Hero 區的課程搜尋功能
 */
const SearchBar = ({
    placeholder = '搜尋課程關鍵字...',
    onSearch,
    className = ''
}) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSearch && query.trim()) {
            onSearch(query.trim());
        }
    };

    const handleChange = (e) => {
        setQuery(e.target.value);
    };

    return (
        <form className={`search-bar ${className}`.trim()} onSubmit={handleSubmit}>
            <div className="search-bar-wrapper">
                <Search className="search-icon" size={20} />
                <input
                    type="text"
                    className="search-input"
                    placeholder={placeholder}
                    value={query}
                    onChange={handleChange}
                    aria-label="課程搜尋"
                />
                <button
                    type="submit"
                    className="search-button"
                    aria-label="搜尋"
                >
                    搜尋
                </button>
            </div>
        </form>
    );
};

export default SearchBar;
