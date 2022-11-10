"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

// List of stories favorited by user. 
let favorites = [];

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  console.log(storyList); 
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
        <button class="favorite-${story.storyId}" id="favorite-button">Toggle favorite</button>
        <button class="remove-whole-story" id="remove-whole-story${story.storyId}">Remove story</button>
      </li>
    `);
}

function generateFavoritesMarkup() {

}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

function addCustomStory() {
  // Save data from form. 
  let $title = $('#title').val();
  let $link = $('#link').val(); 
  let $author = $('#author').val();
  // Create story class based on data from form. 
  let custStory = new Story({storyId: 0, title: $title, author: $author, url: $link, username: currentUser.username, createdAt: 'Just now'});
  // Add new story to storyList. 
  console.log(custStory);
  storyList.stories.unshift(custStory);
  hidePageComponents();
  // Append new story HTML to main page. 
  putStoriesOnPage();
}

// Show favorite stories. 
function showFavorites() {
  hidePageComponents();
  $allStoriesList.empty(); 

  // loop through all of our favorites and generate HTML for them
  for (let story of favorites) {
    console.log(story); 

    const $story = $(`
    <li id="${story.storyId}">
      <a href="${story.url}" target="a_blank" class="story-link">
        ${story.title}
      </a>
      <small class="story-author">by ${story.author}</small>
      <small class="story-user">posted by ${story.username}</small>
      <button class="remove" id="remove-favorite-${story.storyId}">Remove favorite</button>
    </li>
  `);

    $allStoriesList.append($story);
    $allStoriesList.show(); 
  }
}

$(document).ready(() => {
  $(document).on('click', '#favorite-button', (e) => {
    console.log('clicked'); 
    let $story_id = $(e.target).parent().attr('id');
    console.log($story_id);

    for (let i = 0; i < storyList.stories.length; i++) {
      let story = storyList.stories[i]; 
      
      // If the storyId is found and favorites does not include the story...
      if (story.storyId == $story_id && !favorites.includes(story)) {
        // Add story to favorites list. 
        favorites.push(story);
        $(`.favorite-${$story_id}`).remove(); 
      } 
    }
    console.log(favorites); 
  }); 

  $(document).on('click', '.remove', (e) => {
    console.log('clicked remove');

    let $story_id = $(e.target).parent().attr('id');
    for (let favorite of favorites) {
      if (favorite.storyId == $story_id) {
        // Remove the remove favorite button. 
        $(`#remove-favorite-${favorite.storyId}`).remove();
        // Add favorite button back. 
        $(`#${$story_id}`).append(`<button class="favorite-${favorite.storyId}" id="favorite-button">Toggle favorite</button>`);  
        // Remove favorite from the favorites array. 
        favorites.splice(favorite, 1); 
        showFavorites(); 
        console.log(favorites); 
      }
    }
  })

  $(document).on('click', '.remove-whole-story', (e) => {
    console.log('clicked remove whole story'); 
  }); 

  $(document).on('click', '#nav-favorites', (e) => {
    showFavorites(); 
  })
}); 
  

$('#submit-form').on('submit', (e) => {
  e.preventDefault(); 

  addCustomStory();
});