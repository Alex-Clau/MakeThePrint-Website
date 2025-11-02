import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import emailjs from "@emailjs/browser";
import { checkEmailExists, createUserAccount } from "../../firestore/firebaseAuth";
import SignupFormStep from "./SignupFormStep";
import VerifySignupOtpStep from "./VerifySignupOtpStep";
import SignupSuccessStep from "./SignupSuccessStep";

emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const OTP_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_OTP_TEMPLATE_ID;

function SignupForm({ onSuccess }) {
    const navigate = useNavigate();
    const [step, setStep] = useState("form");
    const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [otp, setOtp] = useState("");
    const [generatedOtp, setGeneratedOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.email.trim() || !formData.password || !formData.confirmPassword) {
            setError("Please fill all required fields");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const emailExists = await checkEmailExists(formData.email);
            if (emailExists) {
                setError("This email is already registered. Please sign in instead.");
                setLoading(false);
                return;
            }

            const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
            setGeneratedOtp(newOtp);

            await emailjs.send(SERVICE_ID, OTP_TEMPLATE_ID, {
                to_email: formData.email,
                to_name: formData.name,
                otp_code: newOtp,
            });

            setOtp("");
            setStep("verify");
        } catch (err) {
            if (err.text) {
                setError("Failed to send verification email. Please try again.");
            } else {
                setError("An error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        if (!otp) {
            setError("Enter verification code");
            return;
        }
        if (otp !== generatedOtp) {
            setError("Incorrect verification code");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const emailExists = await checkEmailExists(formData.email);
            if (emailExists) {
                setError("This email was registered while you were verifying. Please sign in instead.");
                setLoading(false);
                return;
            }

            await createUserAccount(formData.email, formData.password, formData.name);

            setStep("success");
        } catch (err) {
            if (err.message) {
                setError(err.message);
            } else {
                setError("Failed to create account. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setFormData({ name: "", email: "", password: "", confirmPassword: "" });
        setOtp("");
        setGeneratedOtp("");
        setError("");
        setStep("form");

        if (onSuccess) {
            onSuccess();
        } else {
            navigate('/login');
        }
    };

    if (step === "form") {
        return (
            <SignupFormStep
                formData={formData}
                loading={loading}
                error={error}
                onChange={handleInputChange}
                onSubmit={handleSubmit}
            />
        );
    }

    if (step === "verify") {
        return (
            <VerifySignupOtpStep
                email={formData.email}
                otp={otp}
                error={error}
                loading={loading}
                onOtpChange={(value) => {
                    setOtp(value);
                    setError("");
                }}
                onVerify={handleVerify}
                onBack={() => setStep("form")}
            />
        );
    }

    return <SignupSuccessStep onReset={reset} />;
}

export default SignupForm;