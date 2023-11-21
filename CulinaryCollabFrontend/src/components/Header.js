import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import './Header.css';

const Header = ({ pageTitle }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoggedIn(!!user); // Sets isLoggedIn to true if user is logged in, otherwise false
        });

        // Cleanup subscription on component unmount
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
            <div className="logo-container" onClick={() => navigate('/')}>
                <span className="dummy-logo">🔶</span>
                <h1>Cullinary Collab</h1>
            </div>
            <h2>{pageTitle}</h2>
            <nav className="navigation">
                <button onClick={() => navigate('/public-recipes')}>Public Recipes</button>
                <button onClick={() => navigate('/workshop')}>Workshop</button>
                <button onClick={() => navigate('/browse')}>Browse</button>
                <button onClick={() => navigate('/inventory-page')}>Inventory Page</button>
                {isLoggedIn ? (
                    <button onClick={handleLogout}>Logout</button>
                ) : (
                    <button onClick={() => navigate('/login')}>Login</button>
                )}
            </nav>
        </header>
    );
};

export default Header;

