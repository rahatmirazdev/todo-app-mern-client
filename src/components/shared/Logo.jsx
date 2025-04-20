import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

const Logo = ({ size = "default", linkTo = "/", showText = true }) => {
    // Size classes for the logo container
    const sizeClasses = {
        small: "h-7 w-7",
        default: "h-9 w-9",
        large: "h-12 w-12"
    };

    return (
        <Link to={linkTo} className="flex items-center space-x-2">
            <div className={`${sizeClasses[size] || sizeClasses.default} rounded`}>
                <img src={logo} alt="Taski Logo" className='w-full' />
            </div>
            {showText && <span className="text-xl font-bold text-gray-800 dark:text-white">Taski</span>}
        </Link>
    );
};

export default Logo;
