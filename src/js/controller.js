// import icons from '../img/icons.svg'; // parecl 1
// import icons from 'url:../img/icons.svg'; // parcel 2
import * as model from './model';
import { MODAL_CLOSE_SEC } from './config';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import paginationView from './views/paginationView';
import bookmarkView from './views/bookmarkView';
import addRecipeView from './views/addRecipeView';
// console.log(icons);

// if(module.hot){
//   module.hot.accept();
// };

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id)

    if (!id) return;
    // load spinner
    recipeView.renderSpinner();

    // update result view to mark selected recipe
    resultsView.update(model.getSearchResultsPage());

    // update bookmark view
    bookmarkView.update(model.state.bookmarks);

    // Loading recipe
    await model.loadRecipe(id);

    // Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1. Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // Load search results
    await model.loadSearchResults(query);

    // Render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  // Render NEW Results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Render NEW Pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // update recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmarks = function () {
  // add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmarks(model.state.recipe);
  else model.deleteBookmarks(model.state.recipe.id);

  // update recipe view
  recipeView.update(model.state.recipe);

  // render the bookmaark
  bookmarkView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlUpload = async function (newr) {
  try {
    // show loading spinner
    addRecipeView.renderSpinner();
    // upload the new recipe data
    await model.uploadRecipe(newr);
    console.log(model.state.recipe);

    // Render the new recipe
    recipeView.render(model.state.recipe);

    // success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarkView.render(model.state.bookmarks);

    // change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('upload error', err);
    addRecipeView.renderError(err.message);
  }
};

const newFeature = function () {
  console.log('welcome to the application');
};

const init = function () {
  addRecipeView.addHandlerUpload(controlUpload);
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmarks);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};

init();

// window.addEventListener('hashchange', controlRecipe)
// window.addEventListener('load', controlRecipe)
