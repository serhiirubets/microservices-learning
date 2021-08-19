import React, {useEffect, useState} from 'react';
import axios from "axios";

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    const { data } = await axios.get(`http://localhost:7001/posts/${postId}/comments`);
    setComments(data);
  }
  
  useEffect(() => {
    fetchComments();
  }, []);
  
  const renderedComments = comments.map(comment => {
    return <li key={comment.id}>{comment.content}</li>
  });
  
  return <ul>{renderedComments}</ul>
}

export default CommentList;