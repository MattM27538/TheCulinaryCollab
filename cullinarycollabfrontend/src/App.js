import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import AboutPage from './components/AboutPage';
import PublicRecipesPage from './components/PublicRecipesPage';
import WorkshopPage from './components/WorkshopPage';

function App() {
    return (
        <Router>
            <div className="App">
                <Header pageTitle={""} /> {}
                <Routes>
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/public-recipes" element={<PublicRecipesPage />} />
                    <Route path="/workshop" element={<WorkshopPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

