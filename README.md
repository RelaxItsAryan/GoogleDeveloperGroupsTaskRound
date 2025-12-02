# GDGC Member Profiles --- Full Stack Project

This project is a combination of a custom-designed frontend interface
and a simple backend API that work together to display GDGC member
profiles. The goal is to create a clean, original UI while ensuring
smooth data handling through the backend. A deployment link is required
as part of the final submission.

## Project Overview

The application includes a splash screen, a grid of member cards, search
and filtering options, theme toggling, and dynamic data fetching. The
backend provides structured member data through two API endpoints, which
the frontend consumes.

## Features

### 1. Splash Screen

-   Shows the application name and logo.
-   Includes a short animation.
-   Redirects automatically to the main page.

### 2. Member Cards

-   Displayed in a grid layout for better visual organization.
-   Each card contains a photo, name, role, skills, and a short bio.
-   You can design the cards in any style you prefer, including layout,
    colors, and shapes.

### 3. Search and Filters

-   Users can search members by name or by bio.
-   At least two filter options must be included, such as role, skills,
    or location.

### 4. Light/Dark Mode

-   A theme toggle option that remembers the user's choice.
-   Applies theme changes to the entire interface, including the splash
    screen.

### 5. Data Fetching

-   Member details are fetched from the backend using the `/members`
    endpoint.
-   Proper loading and error states should be displayed during data
    requests.

## Frontend

Recommended technologies: - HTML, CSS, JavaScript or React - Responsive
layout and smooth animations - Clean, modern design adaptable to light
and dark modes

## Backend

A simple API that provides member data for the frontend.

### Required Endpoints

  Method   Endpoint       Description
  -------- -------------- ------------------------------------
  GET      /members       Returns a JSON list of all members
  GET      /members/:id   Returns details of a single member

Recommended stack: Node.js with Express.

## Suggested Project Structure

project/ │ ├── frontend/ │ ├── index.html │ ├── styles.css │ ├──
script.js │ └── assets/ │ └── backend/ ├── server.js ├── data/ │ └──
members.json └── routes/

## Deployment

A live deployment link is required. Suggested platforms: - Frontend:
Netlify or Vercel - Backend: Render, Vercel, or Railway

## Running the Project Locally


### Frontend

Open the index.html file directly or run it using a live server
extension.

## Possible Future Improvements

-   Dedicated member detail pages or modals
-   Pagination for larger datasets
-   More advanced animations
-   Integration with a database for persistent storage
