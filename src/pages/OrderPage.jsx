import ReviewsCarousel from "../components/ui/carousel/ReviewsCarousel.jsx";
import ReviewForm from "../components/ui/forms/ReviewForm.jsx";
import OrderForm from '../components/ui/forms/OrderForm.jsx';
import {useLoaderData, useNavigate} from "react-router-dom";
import {useContext, useEffect} from "react";
import {ReviewsContext} from "../components/context/reviews-context/ReviewsContext.jsx";
import ErrorModal from "../components/ui/modals/ErrorModal.jsx";

function OrderPage() {

    const navigate = useNavigate();
    const {reviews, error} = useLoaderData();
    const {setReviews} = useContext(ReviewsContext);

    useEffect(() => {
        if (reviews) setReviews(reviews);
    }, [reviews]);

    if (error) {
        return <ErrorModal
            title="Loader ProductsPage error!"
            message={error.message}
            onClose={() => navigate("../")}
        />;
    }

    return (
        <div className="min-h-screen  bg-black/20 text-white pt-30 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">

                {/* Reviews */}
                <ReviewsCarousel/>

                <h1 className="text-5xl font-bold text-center mb-16">Final Steps</h1>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-32 max-w-5xl mx-auto">

                    {/* Order Form */}
                    <div className="h-full">
                        <OrderForm />
                    </div>

                    {/* Review Form */}
                    <div className="h-full">
                        <ReviewForm />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderPage;