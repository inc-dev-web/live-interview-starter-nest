# User API Documentation

This document outlines the functionality and requirements for the User API. It covers user creation, deletion, and friend management.

-----

## Data Models

### User

The primary data object representing a user.

```json
{
  "id": "string (uuid)",
  "username": "string",
  "friends": [
    {
      "id": "string (uuid)",
      "username": "string"
    }
  ]
}
```

-----

## Endpoints

### 1\. Create User

Creates a new user account.

  - **Endpoint**: `POST /users`
  - **Description**: Registers a new user in the system. The server generates a unique UUID v4 for the user's `id`.

#### Request Body

```json
{
  "username": "string"
}
```

| Field      | Type   | Description                |
| :--------- | :----- | :------------------------- |
| `username` | string | **Required**. The username |

#### Responses

  - ✅ **`201 Created`**: The user was created successfully. The response body contains the new user object.

    ```json
    {
      "id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
      "username": "newuser",
      "friends": []
    }
    ```

  - ❌ **`409 Conflict`**: The requested username is already taken.

  - ❌ **`400 Bad Request`**: The request body is invalid (e.g., `username` is missing or not a string).

-----

### 2\. Get User Details

Retrieves a single user's profile.

  - **Endpoint**: `GET /users/{id}`
  - **Description**: Fetches the public profile for a user, including their list of friends.

#### URL Parameters

| Parameter | Type   | Description                       |
| :-------- | :----- | :-------------------------------- |
| `id`      | string | **Required**. The user's UUID |

#### Responses

  - ✅ **`200 OK`**: Successfully retrieved the user's data. The response body contains the user object.
  - ❌ **`404 Not Found`**: No user exists with the provided `id`.

-----

### 3\. Delete User

Deletes a user and cleans up their associations.

  - **Endpoint**: `DELETE /users/{id}`
  - **Description**: Permanently removes a user from the system. This is a cascading action: the user will also be removed from all other users' friends lists.

#### URL Parameters

| Parameter | Type   | Description                       |
| :-------- | :----- | :-------------------------------- |
| `id`      | string | **Required**. The user's UUID |

#### Responses

  - ✅ **`204 No Content`**: The user was successfully deleted. No response body is returned.
  - ❌ **`404 Not Found`**: No user exists with the provided `id`.

-----

### 4\. Add a Friend

Creates a friendship between two users.

  - **Endpoint**: `POST /users/{userId}/friends/{friendId}`
  - **Description**: Adds the user specified by `friendId` to the friends list of the user specified by `userId`.

#### URL Parameters

| Parameter  | Type   | Description                                   |
| :--------- | :----- | :-------------------------------------------- |
| `userId`   | string | **Required**. The UUID of the user           |
| `friendId` | string | **Required**. The UUID of the user to add |

#### Responses

  - ✅ **`201 Created`**: The friendship was successfully created. No response body is returned.
  - ❌ **`404 Not Found`**: Either the `userId` or `friendId` does not correspond to an existing user.

-----

### 5\. Remove a Friend

Removes a friendship between two users.

  - **Endpoint**: `DELETE /users/{userId}/friends/{friendId}`
  - **Description**: Removes the user specified by `friendId` from the friends list of the user specified by `userId`.

#### URL Parameters

| Parameter  | Type   | Description                                     |
| :--------- | :----- | :---------------------------------------------- |
| `userId`   | string | **Required**. The UUID of the user             |
| `friendId` | string | **Required**. The UUID of the friend to remove |

#### Responses

  - ✅ **`204 No Content`**: The friendship was successfully removed. No response body is returned.
  - ❌ **`404 Not Found`**: The user specified by `userId` does not exist.
  - ❌ **`400 Bad Request`**: The friendship does not exist, so it cannot be removed.