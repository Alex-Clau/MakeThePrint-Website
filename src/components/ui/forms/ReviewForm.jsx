import { useContext, useState } from 'react';
import { ReviewsContext } from '../../context/reviews-context/ReviewsContext.jsx';
import { Star } from 'lucide-react';
import ErrorMessage from "../ErrorMessage.jsx";
import { useAuthCheck } from "../../firestore/firebaseAuth.js";

function ReviewForm() {
    const { isReady, isAuthenticated, requireAuth } = useAuthCheck();
    const { submitReview } = useContext(ReviewsContext);
    const [formData, setFormData] = useState({
        name: '',
        rating: 5,
        comment: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'rating' ? parseInt(value) : value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isReady) return;
        if (!isAuthenticated) {
            requireAuth();
            window.scrollTo({ top: 0, behavior: 'smooth' })
            return;
        }

        if (!formData.name.trim() || !formData.comment.trim()) {
            setError('Please fill all required fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = await submitReview(formData);
            if (result.success) {
                setSubmitted(true);
                setFormData({ name: '', rating: 5, comment: '' });
                setTimeout(() => setSubmitted(false), 5000);
            } else {
                setError('Failed to submit review. Try again.');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto mb-16">
            {submitted && (
                <div className="bg-green-500/20 border border-green-500 text-green-300 p-4 rounded-lg mb-6 text-center">
                    Review submitted! Pending admin approval.
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 space-y-6">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Leave a Review</h3>

                {error && <ErrorMessage message={error} />}

                <div>
                    <label className="block text-white font-bold mb-2">Your Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        disabled={!isReady || !isAuthenticated}
                        className="focus:border-white w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </div>

                <div>
                    <label className="block text-white font-bold mb-3">Rating</label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => {
                                    if (isReady && isAuthenticated) {
                                        setFormData(prev => ({ ...prev, rating: star }));
                                        setError('');
                                    }
                                }}
                                disabled={!isReady || !isAuthenticated}
                                className="cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Star
                                    size={28}
                                    className={`${
                                        star <= formData.rating
                                            ? 'fill-yellow-500 text-yellow-500'
                                            : 'text-white/30 hover:text-white/60'
                                    } ${isReady && isAuthenticated ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-white font-bold mb-2">Your Review</label>
                    <textarea
                        name="comment"
                        value={formData.comment}
                        onChange={handleChange}
                        placeholder="Share your experience..."
                        rows="4"
                        disabled={!isReady || !isAuthenticated}
                        className="focus:border-white w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-secondary transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || !isReady}
                    className="cursor-pointer w-full px-6 py-3 font-bold bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {!isReady ? 'Loading...' : !isAuthenticated ? 'Login to Review' : loading ? 'Submitting...' : 'Submit Review'}
                </button>
            </form>
        </div>
    );
}

export default ReviewForm;