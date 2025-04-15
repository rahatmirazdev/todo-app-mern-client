import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import MainLayout from "../layouts/main/MainLayout";
import DashboardLayout from "../layouts/dashboard/DashboardLayout";
import Home from "../pages/Home/Home";
import Dashboard from "../pages/dashboard/Dashboard";
import Analytics from "../pages/dashboard/analytics/Analytics";
import Projects from "../pages/dashboard/projects/Projects";
import Calendar from "../pages/dashboard/calendar/Calendar";
import Messages from "../pages/dashboard/messages/Messages";
import Settings from "../pages/dashboard/settings/Settings";
import ErrorElement from "../pages/error/ErrorElement";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Profile from "../pages/dashboard/profile/Profile";
import { AuthProvider } from "../context/AuthContext";
import About from "../pages/about/About";
import Todo from "../pages/dashboard/todo/Todo";
import { TodoProvider } from "../context/TodoContext";
import ErrorBoundary from '../components/shared/ErrorBoundary';

// Protected route component
const ProtectedRoute = () => {
    const userToken = localStorage.getItem('userToken');

    if (!userToken) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

// Create app element with AuthProvider
const AppElement = () => (
    <AuthProvider>
        <TodoProvider>
            <ErrorBoundary>
                <Outlet />
            </ErrorBoundary>
        </TodoProvider>
    </AuthProvider>
);

const router = createBrowserRouter([
    {
        element: <AppElement />,
        errorElement: <ErrorElement />,
        children: [
            {
                path: "/",
                element: <MainLayout />,
                errorElement: <ErrorElement />,
                children: [
                    {
                        index: true,
                        element: <Home />
                    },
                    {
                        path: "login",
                        element: <Login />
                    },
                    {
                        path: "register",
                        element: <Register />
                    },
                    {
                        path: "about",
                        element: <About />
                    }
                ],
            },
            {
                path: "/dashboard",
                element: <DashboardLayout />,
                errorElement: <ErrorElement />,
                children: [
                    {
                        element: <ProtectedRoute />,
                        errorElement: <ErrorElement />,
                        children: [
                            {
                                index: true,
                                element: <Dashboard />
                            },
                            {
                                path: "analytics",
                                element: <Analytics />
                            },
                            {
                                path: "projects",
                                element: <Projects />
                            },
                            {
                                path: "calendar",
                                element: <Calendar />
                            },
                            {
                                path: "messages",
                                element: <Messages />
                            },
                            {
                                path: "profile",
                                element: <Profile />
                            },
                            {
                                path: "settings",
                                element: <Settings />
                            },
                            {
                                path: "todos",
                                element: <Todo />
                            }
                        ]
                    }
                ]
            }
        ]
    }
]);

export default router;