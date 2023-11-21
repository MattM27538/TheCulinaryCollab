import React, { useState } from 'react';

const RecipeSearchBar = ({personalRecipes, savedRecipes, publicRecipes, onView }) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [searchResults, setSearchResults] = useState([]);

	const handleInputChange = (e) => {
		setSearchTerm(e.target.value);
		console.log(searchTerm);
	};

	const handleSearch = () => {
		const lowercasedTerm = searchTerm.toLowerCase();
		const filtered = [...personalRecipes, ...savedRecipes,...publicRecipes].filter(
			(recipe) =>
			(recipe.name && recipe.name.toLowerCase().includes(lowercasedTerm)) ||
			(recipe.ingredients &&
				recipe.ingredients.some((ingredient) => ingredient.ingredient.toLowerCase().includes(lowercasedTerm)))
		);
		setSearchResults(filtered);
	};
	return (
		<div>
		<div className="search-bar-container">
		<input
		type="text"
		placeholder="Search for recipe"
		value={searchTerm}
		onChange={handleInputChange}
		className="search-bar"
		/>
		<button onClick={handleSearch} className="search-button">Search</button>
		</div>
		<ul className="search-results-list">
		{searchResults.map((recipe, index) => (
			<li key={index} className="search-result-item">
			{recipe.name}
			<button onClick={() => onView(recipe)} className="view-recipe-button">View</button>
			</li>
		))}
		</ul>
		</div>
	);
};

export default RecipeSearchBar;

