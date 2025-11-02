import { useContext } from 'react';
import { ReviewsContext} from "../../context/reviews-context/ReviewsContext.jsx";
import { Star, Check, X } from 'lucide-react';

function ManageReviews() {
    const { allReviews, approveReview, rejectReview } = useContext(ReviewsContext);
    const pendingReviews = allReviews.filter(r => !r.approved);
    const approvedReviews = allReviews.filter(r => r.approved);

    const handleApprove = async (docId) => {
        try {
            await approveReview(docId);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleReject = async (docId) => {
        try {
            await rejectReview(docId);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="text-white">
            <h2 className="text-2xl font-bold mb-8">Manage Reviews</h2>

            {/* Pending */}
            <div className="mb-12">
                <h3 className="text-xl font-bold text-yellow-500 mb-6">Pending Approval ({pendingReviews.length})</h3>
                {pendingReviews.length === 0 ? (
                    <p className="text-gray-400">No pending reviews</p>
                ) : (
                    <div className="space-y-4">
                        {pendingReviews.map(review => (
                            <div key={review.docId} className="bg-white/10 p-6 rounded-lg border border-white/20">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="font-bold text-white">{review.name}</p>
                                        <div className="flex gap-1 mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={16}
                                                    className={i < review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400">
                                        {typeof review.createdAt === 'object' && review.createdAt.toDate
                                            ? new Date(review.createdAt.toDate()).toLocaleDateString()
                                            : new Date(review.createdAt).toLocaleDateString()
                                        }
                                    </p>
                                </div>
                                <p className="text-gray-300 mb-4">{review.comment}</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleApprove(review.docId)}
                                        className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-all"
                                    >
                                        <Check size={16} /> Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(review.docId)}
                                        className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-all"
                                    >
                                        <X size={16} /> Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Approved */}
            <div>
                <h3 className="text-xl font-bold text-green-500 mb-6">Approved ({approvedReviews.length})</h3>
                {approvedReviews.length === 0 ? (
                    <p className="text-gray-400">No approved reviews</p>
                ) : (
                    <div className="space-y-4">
                        {approvedReviews.map(review => (
                            <div key={review.docId} className="bg-white/10 p-6 rounded-lg border border-white/20">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <p className="font-bold text-white">{review.name}</p>
                                        <div className="flex gap-1 mt-1 mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={16}
                                                    className={i < review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-gray-300">{review.comment}</p>
                                    </div>
                                    <button
                                        onClick={() => handleReject(review.docId)}
                                        className="cursor-pointer px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-all ml-4"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManageReviews;