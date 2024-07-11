import React, { useRef, useState } from 'react';
import './Searchbar.scss';
import userImg from '../../assets/user.png';
import { axiosClient } from '../../utils/axiosClient';
import { useNavigate } from 'react-router-dom';
import { IoSearchOutline } from "react-icons/io5";

function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const navigate = useNavigate();
    const searchBarRef = useRef(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosClient.get(`/search/user?query=${query}`);
            console.log('response @ Searchbar', response.result.users);
            setResults(response.result.users);
        } catch (error) {
            console.error('Error searching users:', error);
        }
    };

    const handleUserClick = (userId) => {
        navigate(`/profile/${userId}`);
    };

    const handleClickOutside = (event) => {
        if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
            setResults([]);
        }
    };

    React.useEffect(() => {
        if (results.length > 0) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [results]);

    return (
        <div className="searchbar" ref={searchBarRef}>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search users..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <div className="search-button hover-link" onClick={handleSearch}>
                    <IoSearchOutline />
                </div>
            </form>
            {results.length > 0 && (
                <div className="search-results">
                    <div className="results-container">
                        {results.slice(0, 15).map(user => (
                            <div 
                                key={user._id} 
                                className="search-result-item"
                                onClick={() => handleUserClick(user._id)}
                            >
                                <img 
                                    src={user.avatar?.url || userImg} 
                                    alt={user.name} 
                                    className="avatar"
                                />
                                <span className='user-name'>{user.name} </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default SearchBar;
