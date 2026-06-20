# 🌐 Swagger API Testing Guide

This guide details how to perform interactive API testing using the built-in Swagger UI.

---

## 🚀 Accessing Swagger UI

1. Make sure the Spring Boot backend application is running.
   ```bash
   mvn spring-boot:run
   ```
2. Open your web browser and navigate to:
   ```text
   http://localhost:8080/swagger-ui.html
   ```
   This will redirect you to the Swagger UI page: `http://localhost:8080/swagger-ui/index.html`.

---

## 🔑 Authenticating/Authorizing in Swagger

Most of the endpoints (except the authentication endpoints and public swagger docs) require a valid JWT token.

1. **Step 1: Obtain a JWT Token**
   - In Swagger UI, scroll to the **Authentication** section.
   - Click on the **POST `/api/auth/login`** endpoint.
   - Click the **"Try it out"** button.
   - Enter credentials for an Admin, Faculty, or Student. For example, to log in as an Admin:
     ```json
     {
       "username": "admin",
       "password": "adminpassword"
     }
     ```
   - Click **"Execute"**.
   - Copy the string inside the `"token"` field from the response JSON.

2. **Step 2: Apply the Token**
   - Scroll to the top of the Swagger UI page.
   - Click the green **"Authorize"** button (located on the right side).
   - In the modal that appears, enter the JWT token you copied into the **Value** text box under `bearerAuth (http, Bearer)`.
     *(Note: Since this is configured as a `bearer` scheme, Swagger automatically handles the `Bearer ` prefix. Just enter the raw token value).*
   - Click **"Authorize"**, then click **"Close"**.

Now all your subsequent requests from Swagger UI will automatically include the `Authorization: Bearer <your_token>` header.

---

## 🧪 Testing Endpoints

Once authorized, you can test any endpoint:
1. Click on the API method name (e.g., `GET /api/admin/students`, `POST /api/faculty/marks`).
2. Click **"Try it out"**.
3. Fill in any required Path parameters (like `{id}`), Query parameters (like `page`, `size`), or Request Body JSON.
4. Click **"Execute"**.
5. Inspect the:
   - **Request URL** (exact URL called).
   - **Response body** (JSON response).
   - **Response headers** (Content-Type, etc.).
   - **HTTP status code** (e.g., `200`, `201`, `401`, `403`, `404`).

---

## 🚪 Switching Roles / Logging Out
If you want to test another role's permissions (e.g., student role restrictions on results or faculty restrictions on marks):
1. Click the **"Authorize"** button again.
2. Click **"Logout"**.
3. Authenticate with the other user's credentials via `/api/auth/login` to obtain their token.
4. Click **"Authorize"** again and paste the new token.
