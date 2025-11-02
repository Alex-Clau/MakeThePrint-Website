import {ChevronLeft, ChevronRight} from 'lucide-react';

function Pagination({currentPage, totalPages, onPageChange}) {
    const getPageNumbers = () => {
        if (totalPages <= 7) return Array.from({length: totalPages}, (_, i) => i + 1);

        const range = [];
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) range.push(i);
        const result = [1];
        if (range[0] > 2) result.push('...');
        result.push(...range);
        if (range[range.length - 1] < totalPages - 1) result.push('...', totalPages);
        else if (range[range.length - 1] < totalPages) result.push(totalPages);
        return result.length > 0 ? result : [1];
    };

    const scrollToProducts = () => {
        const element = document.querySelector('.products-section');
        if (element) {
            setTimeout(() => {
                element.scrollIntoView({behavior: 'smooth', block: 'start'});
            }, 100);
        }
    };

    return (
        totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 sm:gap-4 mt-12 overflow-x-auto pb-2">
                <button onClick={() => {
                    onPageChange(Math.max(currentPage - 1, 1));
                    scrollToProducts();
                }} disabled={currentPage === 1}
                        className="p-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0">
                    <ChevronLeft size={16} className="sm:w-5 sm:h-5"/>
                </button>
                <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                    {getPageNumbers().map((page, idx) => (
                        page === '...' ? <span key={`dots-${idx}`}
                                               className="px-1 sm:px-2 py-2 text-white/50 text-xs sm:text-base">...</span> :
                            <button key={page} onClick={() => {
                                onPageChange(page);
                                scrollToProducts();
                            }}
                                    className={`px-2 sm:px-3 py-2 rounded-lg font-medium text-xs sm:text-base transition-all ${currentPage === page ? "bg-secondary text-blue-900" : "bg-white/10 border border-white/20 text-white hover:bg-white/20"}`}>{page}</button>
                    ))}
                </div>
                <button onClick={() => {
                    onPageChange(Math.min(currentPage + 1, totalPages));
                    scrollToProducts();
                }} disabled={currentPage === totalPages}
                        className="cursor-pointer p-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0">
                    <ChevronRight size={16} className="sm:w-5 sm:h-5"/>
                </button>
            </div>
        )
    );
}

export default Pagination;