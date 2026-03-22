# Movies App

A web application built with **Angular**  using TMDB API, that allows users to explore movies, TV series, using a clean and responsive UI. 

> 🚧 **Note:** This project is still under development. New features and improvements are continuously being added.

---

## Features (Current)

- Browse movies and TV series
- View movie and series details

- User authentication system:
  - Register
  - Login

- Route protection using Auth Guards
- Lazy loading for feature modules

- Modular architecture using Angular modules
- Clean and reusable components
- Responsive design

- Advanced search functionality:
  - Search movies and TV series by name
  - Real-time search using RxJS (debounceTime, switchMap)

- Filtering system:
  - Filter by genre
  - Filter by rating
  - Filter by release year
---

## Tech Stack
- **Angular**
- **TypeScript**
- **HTML5**
- **SCSS**
- **RxJS**
- **Angular Router**
- **REST APIs**

---

## Project Structure
- `core` → services, guards, models, interceptors
- `features` → main application modules (movies, series, auth, home.)
- `shared` → reusable components and modules

---


## Run Locally
-  To run the project locally:
   ```bash
   git clone https://github.com/khaledshallaby74/movies-app.git
   cd movies-app
   npm install
   ng serve
   http://localhost:4200
   
