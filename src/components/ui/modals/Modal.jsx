import { createPortal } from "react-dom";
import { useEffect } from "react";

function Modal({ children, onClose, isOpen }) {
    useEffect(() => {
        if (!isOpen) return;

        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: "fixed",
                    inset: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 40,
                }}
            />
            {/* Modal Content */}
            <div
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 50,
                }}
            >
                <div
                    className="select-text w-full max-w-xs md:max-w-md lg:max-w-lg bg-white rounded-lg shadow-xl p-2 md:p-4 lg:p-6 animate-in fade-in zoom-in duration-200 relative max-h-[70vh] md:max-h-[85vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        WebkitUserSelect: 'text',
                        userSelect: 'text',
                        touchAction: 'auto',
                    }}
                >
                    {children}
                </div>
            </div>
        </>,
        document.getElementById("modal")
    );
}

export default Modal;