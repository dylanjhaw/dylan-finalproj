

import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { supabase } from '../client'

const ReadPosts = (props) => {
    const [posts, setPosts] = useState([]);
    const [sortOption, setSortOption] = useState(localStorage.getItem('sortOption') || 'created_at');
    const [searchTerm, setSearchTerm] = useState(''); 

    useEffect(() => {
        fetchPosts();
    }, [sortOption, searchTerm]); 

    const fetchPosts = async () => {
        let { data } = await supabase
            .from('Posts')
            .select('id, title, author, description, created_at, upvote')
            .order(sortOption, { ascending: sortOption === 'created_at' });

        if (searchTerm) {
            data = data.filter(post => post.title.toLowerCase().includes(searchTerm.toLowerCase())); 
        }
        
        setPosts(data);
    }

    const handleSortOptionChange = (e) => {
        setSortOption(e.target.value);
        localStorage.setItem('sortOption', e.target.value);
    }

    return (
        <div>
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search posts" /> {/* new input field for the search term */}
            <select value={sortOption} onChange={handleSortOptionChange}>
                <option value="created_at">Sort by created time</option>
                <option value="upvote">Sort by upvote count</option>
            </select>
            {posts.map((post, index) => (
                <Card key={index} {...post} />
            ))}
        </div>
    );
};

export default ReadPosts;