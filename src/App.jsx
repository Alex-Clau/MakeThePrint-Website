import {createBrowserRouter, RouterProvider} from "react-router-dom";
import RootLayout from "./pages/RootLayout.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import ItemsContextProvider from "./components/context/items-context/ContextItems.jsx";
import {
    aboutPageLoader,
    homePageLoader,
    productsPageLoader,
    orderPageLoader,
    adminDashboardLoader,
    adminAuthPageLoader,
    loginPageLoader
} from "./components/loaders/loaders.js";
import ProtectedRoute from "./components/admin/ProtectedRoute.jsx";
import AdminDashboard from "./components/admin/AdminDashboard.jsx";
import AdminAuth from "./components/admin/AdminAuth.jsx";
import {useEffect} from "react";
import AboutPage from "./pages/AboutPage.jsx";
import OrderPage from "./pages/OrderPage.jsx";
import ReviewsContextProvider from "./components/context/reviews-context/ContextReviews.jsx";
import LoadingFallback from "./components/ui/LoadingFallback.jsx";
import {cacheItems} from "./components/cache/cacheItems.js";
import {getFeaturedCategory} from "./components/firestore/firestoreFeaturedCategory.js";
import LoginPage from "./pages/LoginPage.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                index: true,
                element: <HomePage/>,
                loader: homePageLoader,
                HydrateFallback: LoadingFallback,
            },
            {
                path: "products",
                element: <ProductsPage/>,
                loader: productsPageLoader,
                HydrateFallback: LoadingFallback,
            },
            {
                path: "about",
                element: <AboutPage/>,
                loader: aboutPageLoader,
                HydrateFallback: LoadingFallback,
            },
            {
                path: "order",
                element: <OrderPage/>,
                loader: orderPageLoader,
                HydrateFallback: LoadingFallback,
            },
            {
                path: "login",
                element: <LoginPage />,
                loader: loginPageLoader,
                HydrateFallback: LoadingFallback,
            }
        ]
    },
    {
        path: "hidden-admin-auth",
        element: <AdminAuth/>,
        loader: adminAuthPageLoader,
        HydrateFallback: LoadingFallback,
    },
    {
        path: "hidden-admin",
        element: <ProtectedRoute><AdminDashboard/></ProtectedRoute>,
        loader: adminDashboardLoader,
        HydrateFallback: LoadingFallback,
    },
])

function App() {

    useEffect(() => {
        // Preload critical data in the background
        cacheItems.getAll().catch(error => {
            console.error("Error preloading items:", error);
        });

        getFeaturedCategory().catch(error => {
            console.error("Error preloading featured category:", error);
        });
    }, []);

    return <ItemsContextProvider>
        <ReviewsContextProvider>
            <RouterProvider router={router}/>
        </ReviewsContextProvider>
    </ItemsContextProvider>
}

export default App;
