import React from 'react';
import { useDrag } from 'react-dnd';

const RecipeItem = ({ recipe, type, onOpenModal }) => {
    const [, drag] = useDrag(() => ({
        type: 'recipe',
        item: { id: recipe.id, type, recipe },
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    return (
        <div ref={drag} className="recipe-item" onClick={() => onOpenModal(recipe)}>
            <h3>{recipe.name}</h3>
            {}
        </div>
    );
};

export default RecipeItem;

