import {useState} from "react";
import LikeButton from "../buttons/LikeButton.jsx";
import ModalItemDetails from "../modals/ModalItemDetails.jsx";

function Item({image, name, id, price}) {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="relative">
            <section className="bg-white/10 rounded-lg shadow-lg overflow-hidden transition-all duration-500 ease-out hover:shadow-xl hover:-translate-y-1 animate-[slide-down-fade-in_0.7s_ease-out] flex flex-col h-full">
                {/* Image */}
                <div className="w-full aspect-square overflow-hidden bg-slate-100">
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onClick={() => setShowModal(true)}
                    />
                </div>

                {/* Content */}
                <div className="flex flex-col justify-between p-4 flex-1">
                    <h3 className="text-lg font-bold text-white drop-shadow-lg line-clamp-1">{name}</h3>

                    <div>
                        <div className="flex justify-between items-center">
                            <p className="text-lg font-bold text-secondary">${price}</p>
                            <LikeButton id={id}/>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="cursor-pointer w-full px-4 py-2 bg-blue-800 hover:bg-blue-700 text-white font-bold rounded-lg transition-all mt-3"
                        >
                            View Details
                        </button>
                    </div>
                </div>
            </section>

            <ModalItemDetails showModal={showModal} setShowModal={setShowModal} itemId={id} />
        </div>
    );
}

export default Item;