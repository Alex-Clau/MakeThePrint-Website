import {useState} from "react";
import ModalItemDetails from "../modals/ModalItemDetails.jsx";
import LikeButton from "../buttons/LikeButton.jsx";

function CompactItem({image, name, id, price}) {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div className="group relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden hover:border-secondary/50 transition-all duration-300 hover:bg-white/15 p-4 flex items-center gap-4 animate-[slide-down-fade-in_0.7s_ease-out]">
                {/* Image */}
                <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
                    <img onClick={() => setShowModal(true)} src={image} alt={name} className="w-full h-full object-cover" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-sm line-clamp-1">{name}</h3>
                    <p className="text-secondary font-bold">${price}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                    <button
                        onClick={() => setShowModal(true)}
                        className="cursor-pointer px-3 py-2 bg-blue-800 hover:bg-blue-700 text-white font-medium rounded-lg transition-all text-sm"
                    >
                        View
                    </button>
                    <LikeButton id={id}/>
                </div>
            </div>

            <ModalItemDetails showModal={showModal} setShowModal={setShowModal} itemId={id} />
        </>
    );
}

export default CompactItem;