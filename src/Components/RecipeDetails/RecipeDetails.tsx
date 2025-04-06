import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { RecipeDetailsType } from '../../types';
import RecommendationCard from '../../containers/RecommendationCard';
import { getMealById, getDrinkById } from '../../helpers/fetchApi';
import blackHeartIcon from '../../images/blackHeartIcon.svg';
import whiteHeartIcon from '../../images/whiteHeartIcon.svg';
import shareIcon from '../../images/shareIcon.svg';
import useRecipeInProgress from '../../hooks/useRecipeInProgress';
import './RecipeDetails.css';

function RecipeDetails(props: any) {
  const [mealsRecomendation, setMealsRecomendation] = useState<RecipeDetailsType[]>([]);
  const [linkCopied, setLinkCopied] = useState(false);
  const { handleFavorite,
    isFavorited, setIsFavorited, setMealData, serDrinkData,
    handleCountIngredients } = useRecipeInProgress();
  const { pathname } = useLocation();

  // ... rest of your state and effects remain the same ...

  return (
    <div className="recipe-details">
      {recipes && recipes.length > 0 ? (
        recipes.map((recipe, index) => (
          <div key={index} className="recipe-card">
            <h1 className="recipe-title" data-testid="recipe-title">
              {recipe.strMeal || recipe.strDrink}
            </h1>
            <img
              className="recipe-image"
              src={tipo === 'meals' ? recipe.strMealThumb : recipe.strDrinkThumb}
              alt=""
              data-testid="recipe-photo"
            />
            <p className="recipe-category" data-testid="recipe-category">
              {recipe.strCategory}
              {recipe.strAlcoholic && ` • ${recipe.strAlcoholic}`}
            </p>
            <div className="ingredients-section">
              {paragraphs.map((index1) => {
                const ingredientKey = `strIngredient${index1}` as keyof RecipeDetailsType;
                const measureKey = `strMeasure${index1}` as keyof RecipeDetailsType;
                
                if (recipe[ingredientKey]) {
                  return (
                    <p
                      key={index1}
                      className="ingredient-item"
                      data-testid={`${index1 - 1}-ingredient-name-and-measure`}
                    >
                      <span>{recipe[ingredientKey]}</span>
                      <span>{recipe[measureKey]}</span>
                    </p>
                  );
                }
                return null;
              })}
            </div>
            <p className="instructions" data-testid="instructions">
              {recipe.strInstructions}
            </p>
            {recipe.strYoutube && (
              <div className="video-container" data-testid="video">
                <iframe
                  src={recipe.strYoutube.replace('watch?v=', 'embed/')}
                  title="Recipe Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="loading">Loading...</p>
      )}

      <div className="recommendations">
        {recommendations && recommendations.slice(0, 6).map((recipe, index) => (
          <RecommendationCard key={index} recipe={recipe} index={index} />
        ))}
      </div>

      <div className="action-buttons">
        <button
          className="action-button"
          data-testid="start-recipe-btn"
          onClick={handleProgress}
        >
          {tipo === 'meals' ? 'Start' : 'Continue'} Recipe
        </button>

        <button 
          className="action-button"
          data-testid="share-btn" 
          onClick={handleShare}
        >
          <img src={shareIcon} alt="Share" />
          Share
        </button>

        <button
          className="action-button"
          onClick={handleFavorite}
        >
          <img
            src={isFavorited ? blackHeartIcon : whiteHeartIcon}
            alt="Favorite Recipe"
            data-testid="favorite-btn"
          />
          Favorite
        </button>
      </div>

      {linkCopied && (
        <div className="copy-notification">
          Link copied!
        </div>
      )}
    </div>
  );
}

export default RecipeDetails;