import {useState, useRef, useEffect} from "react";
import {ChevronDown} from 'lucide-react';

function Dropdown({options, selected, onChange, getLabel}) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        onChange(option);
        setOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-blue-900 font-medium hover:bg-secondary/90 transition-all"
            >
                {getLabel(selected)}
                <ChevronDown size={18} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-gray-900 border border-white/20 rounded-lg shadow-xl z-50">
                    {options.map((opt) => (
                        <button
                            key={opt}
                            onClick={() => handleSelect(opt)}
                            className={`cursor-pointer w-full text-left px-4 py-2 transition-all capitalize ${
                                selected === opt
                                    ? "bg-secondary/20 text-secondary"
                                    : "text-white/70 hover:text-white hover:bg-white/10"
                            }`}
                        >
                            {getLabel(opt)}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Dropdown;