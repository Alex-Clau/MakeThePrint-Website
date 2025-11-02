import {useContext} from "react";
import {ItemsContext} from "../../context/items-context/ItemsContext.jsx";
import Modal from "./Modal.jsx";

function ModalItemDetails({showModal, setShowModal, itemId}) {
    const {allItems} = useContext(ItemsContext);
    const item = allItems.find(i => i.id === itemId);

    if (!item) return null;

    return (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
            <div className="w-full aspect-square rounded-xl overflow-hidden mb-3 md:mb-4">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="space-y-3 md:space-y-4 px-2 md:px-0">
                <div>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">{item.name}</h3>
                    <p className="text-xs md:text-sm font-mono text-slate-600 mb-3 md:mb-4 break-all">Id:{item.id}</p>
                    <p className="text-sm md:text-base text-slate-700 leading-relaxed mb-3 md:mb-4 max-h-32 overflow-y-auto">{item.description}</p>
                    <p className="text-xl md:text-2xl font-bold text-primary mb-3 md:mb-4">${item.price}</p>
                </div>
                <div className="flex flex-col md:flex-row gap-2 md:gap-3">
                    <button
                        onClick={() => setShowModal(false)}
                        className="cursor-pointer flex-1 px-4 py-2 bg-slate-200 text-slate-900 font-bold rounded-lg hover:bg-slate-300 transition-all text-sm md:text-base"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default ModalItemDetails;