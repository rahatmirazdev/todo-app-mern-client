import React from 'react'
import { Outlet } from 'react-router-dom'
import ThemeToggle from '../../components/shared/ThemeToggle'
import Header from '../../components/shared/Header'

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
            <Header />
            <main className="">
                <Outlet />
            </main>
        </div>
    )
}

export default MainLayout