"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

// List of stories favorited by user. 
let favorites = [];

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
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
        <button class=favorite-${story.storyId}>Favorite</button>
      </li>
    `);
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
  let custStory = new Story({storyId: 0, title: $title, author: $author, url: $link, username: 'Defalt', createdAt: 'Just now'});
  // Add new story to storyList. 
  console.log(custStory);
  storyList.stories.unshift(custStory);
  hidePageComponents();
  // Append new story HTML to main page. 
  putStoriesOnPage();

  // $('#all-stories-list').prepend(generateStoryMarkup(custStory)); 
}

function toggleFavorite(story) {
  if (favorites.includes(story)) {
    favorites.remove(story); 
    $('.favorite-true').attr('class', 'favorite-false'); 
  } else {
    favorites.push(story); 
    $('.favorite-false').attr('class', 'favorite-true'); 
  }
}

$('#submit-form').on('submit', (e) => {
  e.preventDefault(); 

  addCustomStory();
});