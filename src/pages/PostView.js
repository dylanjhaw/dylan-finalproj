

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../client.js';

const PostView = () => {
     const { id } = useParams();
     
     const [loading, setLoading] = useState(true);
     const [count, setCount] = useState(0);
    
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [newCommentAuthor, setNewCommentAuthor] = useState(''); 

    useEffect(() => {
        console.log('useEffect is being executed');
        fetchPost();
        fetchComments();
    }, [id]);
    
    const fetchPost = async () => {
        const { data, error } = await supabase
            .from('Posts')
            .select('title, author, description, created_at, upvote')
            .eq('id', id);
        console.log('data:', data);
        console.log('error:', error);
        if (error) {
            console.error('Error fetching post: ', error);
        } else {
            console.log('Setting post and loading state');
            setPost(data[0]);
            setCount(data[0].upvote);
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        const { data, error } = await supabase
            .from('Comments')
            .select('*')
            .eq('post_id', id)
            .order('created_at', { ascending: false });
    
        if (error) {
            console.log('Error fetching comments:', error);
        } else {
            console.log('Fetched comments:', data);
            setComments(data);
        }
    }

    const handleNewCommentChange = (e) => {
        setNewComment(e.target.value);
    }

    const handleNewCommentAuthorChange = (e) => {
        setNewCommentAuthor(e.target.value); 
    }

    const handleNewCommentSubmit = async (e) => {
        e.preventDefault();
    
        console.log('Post id:', id);
    
        try {
            const { data, error } = await supabase
                .from('Comments')
                .insert([
                    { 
                        post_id: parseInt(id), 
                        text: newComment, 
                        author: newCommentAuthor, 
                        created_at: new Date() 
                    }
                ]);
    
            if (error) {
                console.log('Error submitting new comment:', error);
            } else {
                console.log('New comment submitted successfully:', data);
                setNewComment('');
                setNewCommentAuthor('');
                fetchComments();
            }
        } catch (error) {
            console.error('Error submitting new comment:', error);
        }
    }

    const handleUpvote = async () => {
        try {
            const { data, error } = await supabase
                .from('Posts')
                .update({ upvotes: post.upvotes + 1 })
                .eq('id', post.id);
    
            if (error) {
                console.log('Error upvoting post:', error);
            } else {
                console.log('Post upvoted successfully:', data);
                
                setPost({ ...post, upvotes: post.upvotes + 1 });
            }
        } catch (error) {
            console.error('Error upvoting post:', error);
        }
    }

    return (
        <div>
            {post && (
                <>
                    <h2>{post.title}</h2>
                    <h3>{"by " + post.author}</h3>
                    <p>{post.description}</p>
                    <p>{"Posted: " + new Date(post.created_at).toLocaleString()}</p>
                    
                    <p>{"Upvotes: " + post.upvote}</p>
                    <button onClick={handleUpvote}>Upvote</button>
                    <form onSubmit={handleNewCommentSubmit}>
                <input type="text" value={newCommentAuthor} onChange={handleNewCommentAuthorChange} placeholder="Your name" required /> {/* new input field for the new comment author */}
                <input type="text" value={newComment} onChange={handleNewCommentChange} placeholder="New comment" required />
                <button type="submit">Submit</button>
            </form>
    
                    
                    {comments.map((comment) => (
    <div key={comment.id} style={{ border: '1px solid white', padding: '10px', margin: '10px' }}>
        <p>{comment.text}</p>
        <p>{"by " + comment.author}</p>
        <p>{"Posted: " + new Date(comment.created_at).toLocaleString()}</p>
    </div>
))}
                </>
            )}
        </div>
    );

};

export default PostView;