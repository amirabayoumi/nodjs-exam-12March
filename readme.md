# Snippet Management System

## Project Overview
- This project is a snippet management system that allows users to:
  - Manage code snippets
  - Filter snippets by language and tags
  - View snippets in a user-friendly dashboard
- **Backend**: Built using Node.js, Express, and MongoDB
- **Frontend**: Served with EJS templates and HTML

## Features:
1. API for managing snippets (create, read, update, delete).
2. Filters to search snippets by language and tags.
3. A dashboard to view snippets in an organized table format.
4. Option to dynamically filter snippets on the dashboard.

## API Documentation

### 1. GET /api/snippets
- **Fetches** all snippets with optional filters applied.

#### Query Parameters:
- `language`: Filter by programming language (e.g., "javascript", "python").
- `tags`: Filter by tags (comma-separated values, e.g., "async,fetch").
- `page`: The page number for pagination.
- `limit`: The number of snippets to return per page.
- `sort`: Field to sort by (e.g., "createdAt").
- `order`: Sorting order (either "asc" or "desc").

#### Response:
- **200 OK**: Returns a list of snippets that match the query parameters.
- **400 Bad Request**: If there's an issue with the query or validation errors.

### 2. POST /api/snippets
- **Adds** a new snippet.

#### Request Body:
- `title`: The title of the snippet.
- `code`: The code snippet itself.
- `normal`: The programming language of the snippet.
- `tags`: The tags associated with the snippet.

#### Response:
- **201 Created**: Returns the created snippet object.
- **400 Bad Request**: If the data does not pass validation.

### 3. GET /api/snippets/:id
- **Fetches** a snippet by its ID.

#### Parameters:
- `id`: The unique identifier of the snippet.

#### Response:
- **200 OK**: Returns the snippet data.
- **404 Not Found**: If the snippet with the given ID does not exist.

### 4. DELETE /api/snippets/:id
- **Deletes** a snippet by its ID.

#### Parameters:
- `id`: The unique identifier of the snippet.

#### Response:
- **200 OK**: Returns a success message.
- **404 Not Found**: If the snippet with the given ID does not exist.

### 5. PUT /api/snippets/:id
- **Updates** a snippet by its ID.

#### Parameters:
- `id`: The unique identifier of the snippet.

#### Request Body:
- `title`: The updated title of the snippet.
- `code`: The updated code snippet.
- `normal`: The updated programming language of the snippet.
- `tags`: The updated tags associated with the snippet.

#### Response:
- **200 OK**: Returns the updated snippet data.
- **404 Not Found**: If the snippet with the given ID does not exist.

## Dashboard Explanation
- The Dashboard is a frontend page rendered using EJS. It displays all snippets in a table format with the following columns:
  - **Title**: The name of the snippet.
  - **Code**: The code snippet itself.
  - **Language**: The programming language of the snippet.
  - **Tags**: The tags associated with the snippet.

### Filtering
1. **Language Filter**:
   - Allows you to filter the snippets by programming language.
   - The available options are dynamically loaded from the existing snippets in the database.
   
2. **Tags Filter**:
   - Allows you to filter snippets by tags.
   - Tags are loaded dynamically from the available snippets.

### Functionality
1. The filters allow users to narrow down the displayed snippets based on their selected language or tags.
2. The table updates dynamically to show the filtered results when the user changes any filter.
3. Pagination is handled by the API, so only a specific number of snippets are displayed at a time. The user can scroll through multiple pages of snippets.

## Frontend and Backend Integration

### Frontend (EJS Template)
- The frontend interacts with the backend through AJAX requests using the Fetch API.
- The selected filters (language and tags) are sent as query parameters in the request to the API.
- When the API returns the filtered data, the table is updated dynamically to show the results.

### Backend (Express and MongoDB)
- The backend handles API requests to get snippets, create new snippets, delete, and update them.
- Filters are applied to the database queries using MongoDB's query operators (`$regex`, `$all`, etc.).
- Pagination and sorting are also handled by MongoDB’s built-in methods like `skip()`, `limit()`, and `sort()`.

## Live Demo
You can check the live demo of the Snippet Management System at the following link:

[Live Demo](https://nodjs-exam-12march.onrender.com/)