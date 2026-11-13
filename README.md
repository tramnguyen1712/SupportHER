# Final Team Project

## supportHER

## Progress Report

### Completed Features

* Implemented final frontend pages for Login, Register, Browse, Map, Events, Favorites, Business Submission, and Reviews.
* Connected the frontend to the backend API for businesses, events, users, reviews, submissions, and saved items.
* Login and Register now work with the database through the API instead of only frontend storage.
* Browse page allows users to choose business categories and navigate into the map/discovery flow.
* Map page fetches business data from `/api/businesses`, supports filtering/search behavior, displays selected business details, and allows users to save businesses.
* Events page fetches event data from `/api/events` instead of using hardcoded frontend data.
* Saved/Favorites page displays saved businesses and saved events.
* Business submission page validates user input and posts submitted business data through the API.
* Added database schema support for users, businesses, reviews, events, favorites, submissions, and saved events.
* Added Service Worker caching for offline support, including app shell caching and network-first behavior for API requests with fallback behavior.
* Added PWA manifest, theme color, app icons, and installability support.
* Added an offline fallback page to communicate when some functionality is unavailable offline.
* Standardized static asset paths for CSS, JavaScript, icons, manifest, and service worker registration.


### Known Issues & Limitations

* Review page is mostly implemented but still needs improvement to fully connect reviews to selected businesses in the most polished way.
* Map uses an embedded Google Maps iframe for demo purposes instead of fully interactive dynamic pins tied directly to each business location.
* Offline functionality works for cached pages and previously loaded data, but deeper offline data creation/sync with IndexedDB is not implemented.


## Authentication & Authorization

<!-- Describe your authentication and authorization processes. What techniques are you using? What data is being stored where and how? How do you now it's secure? How are you making sure users only access what they are allowed to? -->

SupportHER uses username/password authentication through the backend API. New users register through the `/register` endpoint, and the backend stores the user account in the MariaDB `users` table. Passwords are not stored as plain text. Instead, the backend creates a random salt for each user and hashes the password using Node's `crypto.pbkdf2()` function before saving it to the database. During login, the submitted password is hashed again with the stored salt and compared to the stored password hash.

The frontend sends login and registration requests to the API using JSON request bodies. After a successful login, the frontend stores the returned user ID in browser `localStorage` so the app can associate saved businesses and saved events with the current user during the demo. User passwords are never stored in `localStorage`.

Authorization is handled by associating user-specific data with a `user_id` in the database. For example, saved businesses are stored in the `favorites` table with both `user_id` and `business_id`, and saved events are stored in the `event_saves` table with both `user_id` and `event_id`. When the frontend requests saved items, it passes the current user ID to the API, and the backend only returns records connected to that user.

The app also uses validation and error handling on API routes. For example, routes check that required fields such as `userId`, `businessId`, `eventId`, username, and password are provided before making database changes. Duplicate saved businesses/events are prevented using unique constraints in the database. This helps keep the saved-items data consistent and prevents users from saving the same item multiple times.

For this course project, authentication is implemented as a functional database-backed login system, but it is not a full production security system. A production version would improve this by using secure server-side sessions or signed tokens, HTTP-only cookies, HTTPS, stronger authorization middleware, and stricter checks to prevent users from changing another user’s saved items.

## PWA Capabilities

<!-- Describe features available to your users offline, caching strategy, installability, theming, etc. -->

* SupportHER includes PWA support for the final project. A web app manifest was added with app name, theme color, start URL, display mode, and app icons. The app also registers a Service Worker that caches the app shell and important static resources such as HTML pages, CSS, JavaScript, icons, and the offline page.

* The Service Worker uses cache-first behavior for static files and network-first behavior for API requests. This allows users to continue viewing pages and previously loaded content after the first successful visit. If the app cannot provide a feature offline, it displays a graceful offline or loading error message instead of failing silently.


## API Documentation

Method   | Route                              | Description
-------- | ---------------------------------- | ---------
`POST`   | `/login`                           | Authenticates user with username and password
`POST`   | `/logout`                          | Logs out the current user
`POST`   | `/register`                        | Creates a new user account
`GET`    | `/users`                           | Retrieves all users from database
`GET`    | `/users/:userId`                   | Retrieves a user by ID
`GET`    | `/businesses`                      | Retrieves all women-owned businesses
`GET`    | `/businesses/:id`                  | Retrieves a business by ID with reviews
`POST`   | `/businesses`                      | Creates a new business
`GET`    | `/businesses/:id/reviews`          | Gets all reviews for a business
`POST`   | `/businesses/:id/reviews`          | Adds a new review to a business
`GET`    | `/favorites?userId=:userId`        | Gets a user's saved/favorite businesses
`POST`   | `/favorites`                       | Adds a business to user's favorites
`DELETE` | `/favorites/:businessId`           | Removes a business from favorites
`GET`    | `/events`                          | Retrieves all upcoming events
`GET`    | `/events/:id`                      | Retrieves an event by ID
`GET`    | `/events/saved?userId=:userId`     | Retrieves saved events for a user
`POST`   | `/events/saved`                    | Saves an event for a user
`DELETE` | `/events/saved/:eventId`           | Removes a saved event for a user
`POST`   | `/submissions`                     | Submits a new business for review
`GET`    | `/submissions`                     | Retrieves all business submissions
`GET`    | `/submissions/:id`                 | Retrieves one business submission by ID


## Database ER Diagram

```markdown

Use this syntax to embed an image in your markdown file:

![](images/erd.png)
```



## Team Member Contributions

#### Tram Nguyen

* Added and connected PWA installability support:
* * Added manifest.webmanifest.
* * Added PWA icons for 192x192 and 512x512.
* * Added manifest and theme-color links to frontend pages.
* Added and improved offline support:
* * Added sw.js Service Worker caching logic.
* * Added sw-register.js to register the Service Worker.
* * Added an offline fallback page.
* * Tested offline behavior through Chrome DevTools.
* Helped update the database schema for the final milestone, including support for users, businesses, reviews, events, favorites, submissions, and saved events.
* Added and tested starter database records for businesses and events so the app has usable demo data after database initialization.
* Helped debug database initialization issues, including fixing SQL table creation syntax and resetting the MariaDB data volume so schema changes would apply correctly.
* Helped connect frontend actions to database-backed API routes, including registration, login, business data, events data, and saved items.
* Worked on finalizing the frontend user flow across the main pages, including Browse, Map, Events, Favorites, Register, Login, and Business Submission.
* Updated the `Browse` page so users can navigate to business discovery, map view, saved items, and events.
* Updated the `Map` page to fetch businesses from /api/businesses, display selected business details, support category filtering, support saving businesses, and provide directions/reviews actions.
* Updated the `Favorites` page so saved businesses and saved events can be shown together in one saved-items page.
* Updated the `Events` page to use API/database event data and improved the save-event interaction so saved events can appear on the saved page.
* Fixed Register/Login frontend behavior so new accounts can be created through /api/register and users can log in through /api/login.
* Improved styling and consistency across final pages, including button behavior, back navigation, and final demo flow.

#### Trish Nguyen

* Contribution 1
* Contribution 2
* ...

#### Raina Yowell

* Contribution 1
* Contribution 2
* ...

#### Milestone Effort Contribution

<!-- Must add to 100% -->

Tram Nguyen   | Trish Nguyen  | Raina Yowell
------------- | ------------- | --------------
X%            | Y%            | Z%