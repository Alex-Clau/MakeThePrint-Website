import { useNavigate } from 'react-router-dom';

export default function useScrollToElement(id) {
    const navigate = useNavigate();

    const handleClick = (e) => {
        e.preventDefault();
        navigate(`../${id}`);

        setTimeout(() => {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
            }
        }, 500);
    };

    return handleClick;
}