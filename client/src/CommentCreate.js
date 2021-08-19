import React, {useState} from 'react';
import axios from "axios";

const CommentCreate = ({ postId }) => {
  const [value, setValue] = useState('');
  
  const onSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`http://localhost:7001/posts/${postId}/comments`, {
      content: value
    });
    setValue('')
  }
  
  return <div>
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="">New Comment</label>
        <input value={value} onChange={e => setValue(e.target.value)} type="text" className="form-control" />
      </div>
      <button className="btn btn-primary">Submit</button>
    </form>
  </div>
}

export default CommentCreate;