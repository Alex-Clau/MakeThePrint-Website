import { useState } from "react";
import emailjs from "@emailjs/browser";
import OrderFormStep from "../order/OrderFormStep.jsx";
import OrderSuccessStep from "../order/OrderSuccessStep.jsx";
import { useAuthCheck } from "../../firestore/firebaseAuth.js";

emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

const ORDER_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_ORDER_TEMPLATE_ID;
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const OWNER_EMAIL = import.meta.env.VITE_OWNER_EMAIL;

function OrderForm() {
    const { isReady, isAuthenticated, requireAuth } = useAuthCheck();
    const [formData, setFormData] = useState({name: "", email: "", phone: "", orderDetails: ""});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isReady) return;
        if (!isAuthenticated) {
            requireAuth();
            window.scrollTo({ top: 0, behavior: 'smooth' })
            return;
        }

        if (!formData.name.trim() || !formData.email.trim() || !formData.orderDetails.trim()) {
            setError("Please fill all required fields");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await emailjs.send(SERVICE_ID, ORDER_TEMPLATE_ID, {
                to_email: OWNER_EMAIL,
                customer_name: formData.name,
                customer_email: formData.email,
                customer_phone: formData.phone || "Not provided",
                order_details: formData.orderDetails,
            });

            setSuccess(true);
            setFormData({name: "", email: "", phone: "", orderDetails: ""});
        } catch (err) {
            console.error("Order Error:", err);
            setError("Failed to submit order");
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setFormData({name: "", email: "", phone: "", orderDetails: ""});
        setError("");
        setSuccess(false);
    };

    if (success) {
        return <OrderSuccessStep onReset={reset} />;
    }

    return (
        <OrderFormStep
            formData={formData}
            error={error}
            loading={loading}
            isReady={isReady}
            isAuthenticated={isAuthenticated}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onReset={reset}
        />
    );
}

export default OrderForm;