import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import './Header.css';

const Header = ({ pageTitle }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showSocialsDropdown, setShowSocialsDropdown] = useState(false);
    const [showDrinksDropdown, setShowDrinksDropdown] = useState(false);
	const navigate = useNavigate();

	    const closeAllDropdowns = () => {
        setShowSocialsDropdown(false);
        setShowDrinksDropdown(false);
    };

	    const handleUserClick = (path) => {
        closeAllDropdowns();
        navigate(path);
    };
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoggedIn(!!user); 
	});
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error('Error signing out: ', error);
        }
    };

return (
        <header className="header">
            <div className="logo-container" onClick={() => {closeAllDropdowns(); navigate('/')}}>
                <img src="/Logo.png" alt="Culinary Collab Logo" className="header-logo" />
                <h1 className="header-title">The Culinary Collab</h1>
            </div>
        <h2>{pageTitle}</h2>
        <nav className="navigation">
            <div className="dropdown">
                <button onClick={() => {
                    closeAllDropdowns();
                    setShowSocialsDropdown(!showSocialsDropdown);
                }}>Socials</button>
                <div className={`dropdown-content ${showSocialsDropdown ? 'show' : ''}`}>
                    <a onClick={() => handleUserClick('/profile')}>Profile</a>
                    <a onClick={() => handleUserClick('/social')}>Social</a>
                </div>
            </div>
            <div className="dropdown">
                <button onClick={() => {
                    closeAllDropdowns();
                    setShowDrinksDropdown(!showDrinksDropdown);
                }}>Drinks</button>
                <div className={`dropdown-content ${showDrinksDropdown ? 'show' : ''}`}>
                    <a onClick={() => handleUserClick('/workshop')}>My drinks</a>
                    <a onClick={() => handleUserClick('/browse')}>Browse</a>
                    <a onClick={() => handleUserClick('/inventory-page')}>Inventory Page</a>
                </div>
            </div>
            {isLoggedIn ? (
                <button onClick={() => {
                    closeAllDropdowns();
                    handleLogout();
                }}>Logout</button>
            ) : (
                <button onClick={() => handleUserClick('/login')}>Login</button>
            )}
        </nav>
    </header>
);
};
export default Header;

