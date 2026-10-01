# Session 2 - Postman API Testing & Peer Review Guide

## Overview
This directory contains the exported Postman collection **`FoodieApp_APIs.postman_collection.json`** for testing public REST APIs and the local FoodieApp MERN backend.

---

## Tasks Summary & Implementation

### Task 1: Collection Setup
- Collection Name: `FoodieApp APIs`
- Organizes requests into logical API test suites with descriptions and JSON payloads.

### Task 2: GET Request Verification (`https://jsonplaceholder.typicode.com/posts`)
- **Method**: `GET`
- **URL**: `https://jsonplaceholder.typicode.com/posts`
- **Expected Status**: `200 OK`
- **Expected Body**: JSON array containing 100 post objects.

### Task 3: POST Request User Creation (`https://jsonplaceholder.typicode.com/users`)
- **Method**: `POST`
- **Header**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "name": "Alex Mercer",
    "email": "alex.mercer@foodieapp.io",
    "role": "Food Critic"
  }
  ```
- **Response**: Returns sent data with HTTP `201 Created` status code and assigned `id: 11`.

### Task 4: Multi-Method Requests with Descriptions
Saved requests in collection:
1. `GET - Fetch All Posts` (Retrieves array of posts)
2. `POST - Create New User` (Creates new user record)
3. `PUT - Update User Profile` (Modifies existing user data)
4. `DELETE - Delete Post` (Removes post ID 1)
5. `POST - Add Restaurant` (Sends restaurant payload to local Node/Express backend)

### Task 5: Export & Peer Review Instructions
To import and test this collection:
1. Open **Postman**.
2. Click **Import** button in top-left corner.
3. Select `FoodieApp_APIs.postman_collection.json` file from `session2/` folder.
4. Run each request and inspect the **Status**, **Response Body**, and **Headers**.
