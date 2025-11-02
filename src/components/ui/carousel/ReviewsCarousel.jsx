import {useContext} from 'react';
import {ReviewsContext} from "../../context/reviews-context/ReviewsContext.jsx";
import {Star} from 'lucide-react';
import Carousel from './Carousel.jsx';

function ReviewsCarousel() {
    const {approvedReviews} = useContext(ReviewsContext);

    const renderItem = (review) => {
        return (
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-10 hover:bg-white/15 transition-all h-full flex flex-col justify-between">
                <div>
                    <div className="flex gap-1 mb-4">
                        {[...Array(5)].map((_, j) => (
                            <Star key={j} className={`w-5 h-5 ${j < review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'}`} />
                        ))}
                    </div>
                    <p className="text-gray-300 mb-4">"{review.comment}"</p>
                </div>
                <div>
                    <p className="font-bold text-yellow-500">{review.name}</p>
                    {review.createdAt && (
                        <p className="text-xs text-gray-400 mt-2">
                            {new Date(review.createdAt).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                        </p>
                    )}
                </div>
            </div>
        );
    };

    if (approvedReviews.length === 0) {
        return (
            <div className="mb-12">
                <h3 className="text-3xl font-bold text-white mb-8 text-center">Customer Reviews</h3>
                <div className="text-center py-8 text-gray-300">
                    <p>No reviews yet. Be the first to review!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-16">
            <h3 className="block text-3xl font-bold text-white text-center animate-slide-in">Customer Reviews</h3>
            <p className="text-gray-300 text-center mb-4 animate-slide-in">See what our customers think and place your order
            today.</p>
            <Carousel items={approvedReviews} itemsPerSlide={3} renderItem={renderItem} mobileItemWidth={80} />
        </div>
    );
}

export default ReviewsCarousel;