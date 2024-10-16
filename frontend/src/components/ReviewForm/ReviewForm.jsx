// ReviewForm.jsx
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createReview } from '../store/reviews'; // Action to create review

const ReviewForm = ({ spotId }) => {
  const dispatch = useDispatch();
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createReview(spotId, { content }));
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write a review" required />
      <button type="submit">Submit Review</button>
    </form>
  );
};

export default ReviewForm;
