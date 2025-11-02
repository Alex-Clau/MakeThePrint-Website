import {Search} from 'lucide-react';
import {useRef, useEffect, useState} from 'react';

const SEARCH_DEBOUNCE_MS = 300;

function SearchBar({value, onChange}) {
    const [displayValue, setDisplayValue] = useState(value);
    const debounceTimer = useRef(null);

    const handleChange = (e) => {
        const inputValue = e.target.value;
        setDisplayValue(inputValue);
        clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => onChange(inputValue), SEARCH_DEBOUNCE_MS);
    };

    useEffect(() => () => clearTimeout(debounceTimer.current), []);

    return (
        <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={20}/>
            <input
                type="text"
                placeholder="Search products..."
                value={displayValue}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder:text-white/50 focus:outline-none focus:border-secondary focus:bg-white/15 transition-all"
            />
        </div>
    );
}

export default SearchBar;