import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/dashboard/Dashboard';
import Search from './pages/dashboard/search/Search';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { TodoProvider } from './context/TodoContext';
import { Suspense } from 'react';
import Spinner from './components/Spinner';

function App() {
    return (
        <Router>
            <AuthProvider>
                <ThemeProvider>
                    <TodoProvider>
                        <NotificationProvider>
                            <Suspense fallback={<Spinner />}>
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/dashboard/*" element={<Dashboard />} />
                                    <Route path="/dashboard/search" element={<Search />} />
                                </Routes>
                            </Suspense>
                        </NotificationProvider>
                    </TodoProvider>
                </ThemeProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;