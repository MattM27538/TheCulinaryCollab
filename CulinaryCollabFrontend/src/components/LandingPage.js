import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
    return (
        <div className="landing-page-container">
            <div className="landing-content">
                {}
            </div>

            <div className="about-button-container">
                <Link to="/about">
                    <button className="about-button">About</button>
                </Link>
            </div>
        </div>
    );
}

export default LandingPage;

