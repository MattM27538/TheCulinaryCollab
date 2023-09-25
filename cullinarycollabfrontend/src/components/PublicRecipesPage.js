import React, { useState, useEffect } from 'react';
import '../components/PublicRecipesPage.css';

const cocktails = [
    {
        name: "Mojito",
        ingredients: [
            { item: "White rum", quantity: "50ml" },
            { item: "Lime juice", quantity: "20ml" },
            { item: "Sugar", quantity: "2 teaspoons" },
            { item: "Mint leaves", quantity: "10" },
            { item: "Soda water", quantity: "100ml" },
            { item: "Ice cubes", quantity: "as required" }
        ],
        instructions: "Muddle mint leaves with sugar. Add lime juice, rum, and top with soda water. Serve with ice."
    },
    {
        name: "Margarita",
        ingredients: [
            { item: "Tequila", quantity: "50ml" },
            { item: "Triple sec", quantity: "20ml" },
            { item: "Lime juice", quantity: "20ml" },
            { item: "Salt", quantity: "for rimming" },
            { item: "Ice cubes", quantity: "as required" }
        ],
        instructions: "Shake tequila, triple sec, and lime juice with ice. Rim glass with salt and strain mixture into glass."
    },
    {
        name: "Cosmopolitan",
        ingredients: [
            { item: "Vodka", quantity: "40ml" },
            { item: "Triple sec", quantity: "15ml" },
            { item: "Cranberry juice", quantity: "30ml" },
            { item: "Lime juice", quantity: "10ml" },
            { item: "Ice cubes", quantity: "as required" }
        ],
        instructions: "Shake all ingredients with ice. Strain into a chilled martini glass."
    },
    {
        name: "Pina Colada",
        ingredients: [
            { item: "White rum", quantity: "50ml" },
            { item: "Coconut milk", quantity: "50ml" },
            { item: "Pineapple juice", quantity: "100ml" },
            { item: "Pineapple slice", quantity: "for garnish" },
            { item: "Cherries", quantity: "for garnish" },
            { item: "Ice cubes", quantity: "as required" }
        ],
        instructions: "Blend all ingredients (except garnishes) until smooth. Pour into a chilled glass and garnish with a slice of pineapple and a cherry."
    },
    {
        name: "Bloody Mary",
        ingredients: [
            { item: "Vodka", quantity: "45ml" },
            { item: "Tomato juice", quantity: "90ml" },
            { item: "Lemon juice", quantity: "15ml" },
            { item: "Worcestershire sauce", quantity: "2 dashes" },
            { item: "Tabasco", quantity: "2 dashes" },
            { item: "Celery salt", quantity: "1 pinch" },
            { item: "Pepper", quantity: "1 pinch" },
            { item: "Celery stick", quantity: "for garnish" }
        ],
        instructions: "Shake all ingredients with ice. Strain into a large glass filled with ice and garnish with a celery stick."
    },
    {
        name: "Old Fashioned",
        ingredients: [
            { item: "Whiskey", quantity: "45ml" },
            { item: "Sugar cube", quantity: "1" },
            { item: "Angostura bitters", quantity: "2 dashes" },
            { item: "Water", quantity: "1 dash" },
            { item: "Orange twist", quantity: "for garnish" },
            { item: "Ice cubes", quantity: "as required" }
        ],
        instructions: "Muddle sugar cube, water, and bitters. Add ice and whiskey. Garnish with an orange twist."
    }
];

const newCocktails = [
    {
        name: "Gin Tonic",
        ingredients: [
            { item: "Gin", quantity: "50ml" },
            { item: "Tonic Water", quantity: "100ml" },
            { item: "Lime wedge", quantity: "1" },
            { item: "Ice cubes", quantity: "as required" }
        ],
        instructions: "Fill a glass with ice cubes. Add gin, top with tonic water and garnish with a lime wedge."
    },
    {
        name: "Whiskey Sour",
        ingredients: [
            { item: "Whiskey", quantity: "50ml" },
            { item: "Lemon juice", quantity: "25ml" },
            { item: "Sugar syrup", quantity: "15ml" },
            { item: "Cherry", quantity: "for garnish" },
            { item: "Lemon slice", quantity: "for garnish" }
        ],
        instructions: "Shake whiskey, lemon juice, and sugar syrup with ice. Strain into a chilled glass and garnish with a slice of lemon and a cherry."
    },
    {
        name: "Espresso Martini",
        ingredients: [
            { item: "Vodka", quantity: "50ml" },
            { item: "Coffee liqueur", quantity: "25ml" },
            { item: "Freshly brewed espresso", quantity: "25ml" },
            { item: "Sugar syrup", quantity: "15ml" }
        ],
        instructions: "Shake all ingredients with ice. Strain into a chilled martini glass and serve."
    }
];


const PublicRecipesPage = () => {
    const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
    const [animationDirection, setAnimationDirection] = useState('none');
    const [cardOpacity, setCardOpacity] = useState(1);


    const [newCurrentRecipeIndex, setNewCurrentRecipeIndex] = useState(0);
    const [newAnimationDirection, setNewAnimationDirection] = useState('none');
    const [newCardOpacity, setNewCardOpacity] = useState(1);

    const handlePrevRecipe = () => {
        setAnimationDirection('fade-left');
        setCardOpacity(0);

        setTimeout(() => {
            if (currentRecipeIndex === 0) {
                setCurrentRecipeIndex(cocktails.length - 1);
            } else {
                setCurrentRecipeIndex(prev => prev - 1);
            }
            setTimeout(() => {
                setAnimationDirection('enter-from-left');
                setCardOpacity(1);
            }, 50);
        }, 500);
    };

    const handleNextRecipe = () => {
        setAnimationDirection('fade-right');
        setCardOpacity(0);

        setTimeout(() => {
            if (currentRecipeIndex === cocktails.length - 1) {
                setCurrentRecipeIndex(0);
            } else {
                setCurrentRecipeIndex(prev => prev + 1);
            }

            setTimeout(() => {
                setAnimationDirection('enter-from-right');
                setCardOpacity(1);
            }, 50);
        }, 500);
    };
const handlePrevNewRecipe = () => {
    setNewAnimationDirection('fade-left');
    setNewCardOpacity(0);
    setTimeout(() => {
        if (newCurrentRecipeIndex === 0) {
            setNewCurrentRecipeIndex(newCocktails.length - 1);
        } else {
            setNewCurrentRecipeIndex(prev => prev - 1);
        }
        setTimeout(() => {
            setNewAnimationDirection('enter-from-left');
            setNewCardOpacity(1);
        }, 50);
    }, 500);
};

const handleNextNewRecipe = () => {
    setNewAnimationDirection('fade-right');
    setNewCardOpacity(0);
    setTimeout(() => {
        if (newCurrentRecipeIndex === newCocktails.length - 1) {
            setNewCurrentRecipeIndex(0);
        } else {
            setNewCurrentRecipeIndex(prev => prev + 1);
        }
        setTimeout(() => {
            setNewAnimationDirection('enter-from-right');
            setNewCardOpacity(1);
        }, 50);
    }, 500);
};

    useEffect(() => {
        if (animationDirection) {
            const timer = setTimeout(() => {
                setAnimationDirection(null);
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [animationDirection]);
return (
    <div className="recipe-page-container">

        {/* Original Cocktails */}
        <div className="recipe-container">
            <button className="nav-button nav-button-left" onClick={handlePrevRecipe}>&lt;</button>
            
            <div className={`recipe-card ${animationDirection}`} style={{ opacity: cardOpacity }}>
                <h2>{cocktails[currentRecipeIndex].name}</h2>
                <ul>
                    {cocktails[currentRecipeIndex].ingredients.map((ingredient, i) => (
                        <li key={i}>
                            {ingredient.item}: {ingredient.quantity}
                        </li>
                    ))}
                </ul>
                <div className="instructions-box">
                    {cocktails[currentRecipeIndex].instructions}
                </div>
            </div>
            
            <button className="nav-button nav-button-right" onClick={handleNextRecipe}>&gt;</button>
        </div>

        {/* New Cocktails */}
        <div className="recipe-container">
            <button className="nav-button nav-button-left" onClick={handlePrevNewRecipe}>&lt;</button>
            
            <div className={`recipe-card ${newAnimationDirection}`} style={{ opacity: newCardOpacity }}>
                <h2>{newCocktails[newCurrentRecipeIndex].name}</h2>
                <ul>
                    {newCocktails[newCurrentRecipeIndex].ingredients.map((ingredient, i) => (
                        <li key={i}>
                            {ingredient.item}: {ingredient.quantity}
                        </li>
                    ))}
                </ul>
                <div className="instructions-box">
                    {newCocktails[newCurrentRecipeIndex].instructions}
                </div>
            </div>
            
            <button className="nav-button nav-button-right" onClick={handleNextNewRecipe}>&gt;</button>
        </div>
    </div>
);
} 
export default PublicRecipesPage;
