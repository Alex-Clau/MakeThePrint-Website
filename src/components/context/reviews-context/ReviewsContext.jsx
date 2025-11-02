import { createContext } from 'react';

export const ReviewsContext = createContext({
    allReviews: [],
    approvedReviews: [],
    setReviews: () => {},
    submitReview: () => {},
    approveReview: () => {},
    rejectReview: () => {},
    refresh: () => {},
    error: null,
    clearError: () => {},
});