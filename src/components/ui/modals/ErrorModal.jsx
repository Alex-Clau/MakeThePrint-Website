import Modal from "./Modal.jsx";
import {useNavigate} from "react-router-dom";

function ErrorModal({title, message, onClose}) {

    const navigate = useNavigate();

    function handleClick(){
        onClose();
        navigate('../')
    }

    return (
        <Modal isOpen={!!title} onClose={onClose}>
            <div className="flex flex-col items-center gap-3 md:gap-4 text-center p-2 md:p-4">
                <h1 className="text-xl md:text-2xl font-bold text-primary-dark">{title}</h1>
                <p className="text-base md:text-lg text-primary-light leading-relaxed">{message}</p>
                <button
                    onClick={handleClick}
                    className="
                        mt-4 px-6 py-2
                        bg-primary-dark text-white
                        rounded-2xl
                        outline-none
                        hover:text-black
                        transition-colors
                        font-medium
                        text-sm md:text-base
                        w-full md:w-auto
                           "
                >
                    Close
                </button>
            </div>
        </Modal>
    );
}

export default  ErrorModal;