The content below is an example project proposal / requirements document. Replace the text below the lines marked "__TODO__" with details specific to your project. Remove the "TODO" lines.

# Lobster AI

## Overview

Recall how you have to wander around the internet on different platforms to find different AI services such as music and video generation... 

Lobster AI is a paid AI service that combines major AI platforms and further enhances your interactions with AI. Let the Lobster be in the palm of your hand! Start to have conversations, generate image, music, videos, code with the powerful Lobster! 


## Data Model

The application will store `Users`, `Subscription` and `History`

* each user is linked to a subscription of three tiers: `free`, `standard` and `pro` (via references)
* each user has a history, which records that user's former requests within the app (viewable upon updrading to standard or pro tier)

An Example User:

```javascript
{
  id: 'h1i2uhupuohr10' // use for reference
  username: "shannonshopper",
  hash: // a password hash,
}
```

An Example Subscription

```javascript
{
  user: // a reference to a User object
  tier: "free", // the tier which the user is in
  createdAt: // timestamp
}
```

An Example History

```javascript
{
  user: // a reference to a User object
  history: [ // arr of former reqs made 
    {
      prompt: 'how to embed a youtube link in html?'
      createdAt: // timestamp
    },
    {
      prompt: 'list of best ramen shops in NYC',
      createdAt: // timestamp
    },
    ...
  ]
}
```


## [Link to Commented First Draft Schema](https://github.com/nyu-csci-ua-0467-001-002-spring-2024/final-project-jsl1114/blob/master/prisma/schema.prisma)) 

*note: this app uses [prisma ORM](https://www.prisma.io/), schema is stored within [/prisma/schema.prisma](./prisma/schema.prisma)*

## Wireframes

(__TODO__: wireframes for all of the pages on your site; they can be as simple as photos of drawings or you can use a tool like Balsamiq, Omnigraffle, etc.)

/ - landing page

![landing](./documentation/landing.png)

/dashboard - dashboard page for an overview of all services

![dashboard](./documentation/dashboard.png)

/conversation - page for conversation with lobster

![conversation](./documentation/conversation.png)

/image - page for image generation

![image](./documentation/image.png)

/video - page for video generation

![video](./documentation/video.png)

/code - page for code generation

![code](./documentation/code.png)

/music - page for music generation

![music](./documentation/music.png)

(__TODO__: draw out a site map that shows how pages are related to each other)

Here's a [complex example from wikipedia](https://upload.wikimedia.org/wikipedia/commons/2/20/Sitemap_google.jpg), but you can create one without the screenshots, drop shadows, etc. ... just names of pages and where they flow to.

## User Stories or Use Cases

1. as non-registered user, I can register a new account with the site
2. as a new user defaulted to free tier, I can log in to the site and pay for upgrades
3. as a free tier user, I can send a total of 10 request to the api as free trial. After that, I will be instructed to pay for an upgrade in order to continue using the app
4. as a standard tier user, I pay 39 dollars a month and have access to all the generation tools, with limit on certain features
5. as a pro tier user, I pay 49 dollars a month and have access to all of the features on the website with the newest models, plus access to user history, which shows the past quries and responses, up tp 90 days

## Research Topics

(__TODO__: the research topics that you're planning on working on along with their point values... and the total points of research topics listed)

* (5 points) Integrate user authentication
    * I'm going to be using passport for user authentication
    * And account has been made for testing; I'll email you the password
    * see <code>cs.nyu.edu/~jversoza/ait-final/register</code> for register page
    * see <code>cs.nyu.edu/~jversoza/ait-final/login</code> for login page
* (4 points) Perform client side form validation using a JavaScript library
    * see <code>cs.nyu.edu/~jversoza/ait-final/my-form</code>
    * if you put in a number that's greater than 5, an error message will appear in the dom
* (5 points) next.js
    * used next.js as the frontend framework; it's a challenging library to learn, so I've assigned it 5 points

10 points total out of 8 required points 


## [Link to Initial Main Project File](/app/) 

## Annotations / References Used

(__TODO__: list any tutorials/references/etc. that you've based your code off of)

1. [passport.js authentication docs](http://passportjs.org/docs) - (add link to source code that was based on this)
2. [tutorial on vue.js](https://vuejs.org/v2/guide/) - (add link to source code that was based on this)
