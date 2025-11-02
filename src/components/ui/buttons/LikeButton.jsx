import { useContext } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { ItemsContext } from '../../context/items-context/ItemsContext.jsx';
import { useAuthCheck } from "../../firestore/firebaseAuth.js";

function LikeButton({ id }) {
    const { isReady, isAuthenticated, requireAuth } = useAuthCheck();
    const { allItems, toggleLike } = useContext(ItemsContext);

    const item = allItems.find(i => i.id === id);
    const isLiked = item?.like;

    const handleLikeClick = () => {
        if (!isReady) return;
        if (!isAuthenticated) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            requireAuth();
            return;
        }

        toggleLike(id);
    };

    return (
        <button
            onClick={handleLikeClick}
            disabled={!isReady}
            className="cursor-pointer text-2xl hover:text-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={isLiked ? 'Unlike' : 'Like'}
        >
            {isLiked ? <AiFillHeart className="text-yellow-600" /> : <AiOutlineHeart />}
        </button>
    );
}

export default LikeButton;