import { useReducer } from 'react';
import { ReviewsContext } from './ReviewsContext.jsx';
import { cacheReviews } from "../../cache/cacheReviews.js";

const ACTIONS = {
    SET_REVIEWS: 'SET_REVIEWS',
    ADD_REVIEW: 'ADD_REVIEW',
    APPROVE_REVIEW: 'APPROVE_REVIEW',
    REJECT_REVIEW: 'REJECT_REVIEW',
    SET_ERROR: 'SET_ERROR',
    CLEAR_ERROR: 'CLEAR_ERROR',
};

function reducer(state, action) {
    switch (action.type) {
        case ACTIONS.SET_REVIEWS:
            return {
                ...state,
                allReviews: action.payload,
                approvedReviews: action.payload.filter(review => review.approved)
            };

        case ACTIONS.ADD_REVIEW:
            return {
                ...state,
                allReviews: [action.payload, ...state.allReviews]
            };

        case ACTIONS.APPROVE_REVIEW:
            return {
                ...state,
                allReviews: state.allReviews.map(review =>
                    review.docId === action.payload ? { ...review, approved: true } : review
                ),
                approvedReviews: state.allReviews
                    .map(review => review.docId === action.payload ? { ...review, approved: true } : review)
                    .filter(review => review.approved)
            };

        case ACTIONS.REJECT_REVIEW:
            return {
                ...state,
                allReviews: state.allReviews.filter(review => review.docId !== action.payload),
                approvedReviews: state.approvedReviews.filter(review => review.docId !== action.payload)
            };

        case ACTIONS.SET_ERROR:
            return {
                ...state,
                error: action.payload
            };

        case ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                error: null
            };

        default:
            return state;
    }
}

function ReviewsContextProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, {
        allReviews: [],
        approvedReviews: [],
        error: null
    });

    const setReviews = (reviews) => {
        dispatch({ type: ACTIONS.SET_REVIEWS, payload: reviews });
    };

    async function submitReview(review) {
        try {
            const newReview = await cacheReviews.add(state.allReviews, review);
            dispatch({ type: ACTIONS.ADD_REVIEW, payload: newReview[0] });
            return { success: true };
        } catch (error) {
            console.error('Error submitting review:', error);
            return { success: false, error };
        }
    }

    async function approveReview(docId) {
        const review = state.allReviews.find(r => r.docId === docId);
        if (!review) return;

        try {
            await cacheReviews.update(state.allReviews, review.id, docId, {
                approved: true,
                approvedAt: new Date()
            });
            dispatch({ type: ACTIONS.APPROVE_REVIEW, payload: docId });
        } catch (error) {
            console.error('Error approving review:', error);
            throw error;
        }
    }

    async function rejectReview(docId) {
        const review = state.allReviews.find(r => r.docId === docId);
        if (!review) return;

        try {
            await cacheReviews.remove(state.allReviews, review.id, docId);
            dispatch({ type: ACTIONS.REJECT_REVIEW, payload: docId });
        } catch (error) {
            console.error('Error rejecting review:', error);
            throw error;
        }
    }

    const refresh = async () => {
        try {
            const reviews = await cacheReviews.getAll(true);
            dispatch({ type: ACTIONS.SET_REVIEWS, payload: reviews });
            cacheReviews.clearError();
            dispatch({ type: ACTIONS.CLEAR_ERROR });
        } catch (error) {
            console.error('Error refreshing reviews:', error);
        }
    };

    const clearError = () => {
        cacheReviews.clearError();
        dispatch({ type: ACTIONS.CLEAR_ERROR });
    };

    const reviewsContext = {
        allReviews: state.allReviews,
        approvedReviews: state.approvedReviews,
        setReviews,
        submitReview,
        approveReview,
        rejectReview,
        refresh,
        error: state.error,
        clearError,
    };

    return (
        <ReviewsContext.Provider value={reviewsContext}>
            {children}
        </ReviewsContext.Provider>
    );
}

export default ReviewsContextProvider;