import React from 'react'
import { useState, useEffect } from 'react'
import './Card.css'
import more from './more.png'
import { Link } from 'react-router-dom'
import { supabase } from '../client.js';

const Card = (props) =>  {

  const [count, setCount] = useState(0)
  
  useEffect(() => {
    fetchCount();
}, []);

const fetchCount = async () => {
    const { data, error } = await supabase
        .from('your_table_name') 
        .select('upvotes') 
        .eq('id', props.id);
    if (error) {
        console.error('Error fetching upvote count: ', error);
    } else {
        setCount(data[0].upvotes);
    }
};



const updateCount = async () => {
  
  const { data: fetchData, error: fetchError } = await supabase
      .from('Posts') 
      .select('upvote') 
      .eq('id', props.id);
  if (fetchError) {
      console.error('Error fetching upvote count: ', fetchError);
      return;
  }

  
  const newCount = fetchData[0].upvote + 1;
  const { data: updateData, error: updateError } = await supabase
      .from('Posts') 
      .update({ upvote: newCount }) 
      .eq('id', props.id);
  if (updateError) {
      console.error('Error updating upvote count: ', updateError);
  } else {
      setCount(newCount); 
  }
};

  return (
      <div className="Card">
          <Link to={'edit/'+ props.id}><img className="moreButton" alt="edit button" src={more} /></Link>
          

          <Link to={'view/'+ props.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <h2 className="title">{props.title}</h2>
              <h3 className="author">{"by " + props.author}</h3>
              <p className="description">{props.description}</p>
              
              <p className="created_at">{"Posted: " + new Date(props.created_at).toLocaleString()}</p>
              
          </Link>
          <p className="upvotes">{"Upvotes: " + props.upvote}</p>
          <button className="upvote" onClick={updateCount} >Upvote</button>
          
      </div>
  );
};

export default Card;