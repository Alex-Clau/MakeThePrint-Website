import { useRouteError, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet";

function ErrorPage() {
    const navigate = useNavigate();
    const error = useRouteError();

    let title = "An error occurred!";
    let message = "Something went wrong on our part! Hang tight!";

    if (error?.status === 500) {
        message = error.data?.message || message;
    }

    if (error?.status === 404) {
        title = "Not found!";
        message = "Page not found";
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("../");
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <>
            <Helmet>
                <title>MakeThePrint – Error</title>
                <meta name="description" content="Oops! Something went wrong at MakeThePrint. Redirecting you to the homepage." />
                <meta name="robots" content="noindex, follow" />
            </Helmet>

            <div className="flex flex-col items-center justify-center gap-4 p-8 min-h-[50vh]">
                <h1 className="text-4xl font-bold text-yellow-500">{title}</h1>
                <p className="text-yellow-600 text-center max-w-lg text-lg">{message}</p>
                <p className="text-white text-sm mt-2">
                    Redirecting in 5 seconds...
                </p>
            </div>
        </>
    );
}

export default ErrorPage;
