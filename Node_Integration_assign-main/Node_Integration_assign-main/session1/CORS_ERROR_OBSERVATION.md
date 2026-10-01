# Session 1 - Task 3: CORS Error Observation Report

## Scenario Overview
- **Frontend Origin**: `http://localhost:3000` (or `null` / local file protocol `file://`)
- **Target API Endpoint**: `http://localhost:5000/api/login` (Different Port)
- **HTTP Method**: `POST`
- **Request Headers**: `Content-Type: application/json`

## Observed Browser Console Error Message
When submitting the login form to the cross-origin backend without server-side CORS headers (`Access-Control-Allow-Origin`), the browser blocks the request and outputs the following error in the developer console:

```text
Access to fetch at 'http://localhost:5000/api/login' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## JavaScript Error Handling Result
In JavaScript code, `fetch()` rejects its promise with a generic `TypeError`:
```text
TypeError: Failed to fetch
```

## Technical Explanation of CORS
1. **Same-Origin Policy (SOP)**: Web browsers enforce the Same-Origin Policy for security. Two URLs have the same origin if the protocol, host, and port are identical.
2. **Cross-Origin Request**: Because the port differs (`3000` vs `5000`), the browser sends a preflight `OPTIONS` request or evaluates the response headers.
3. **Missing Headers**: Since `http://localhost:5000` did not return `Access-Control-Allow-Origin: *` or `Access-Control-Allow-Origin: http://localhost:3000`, the browser blocks the frontend code from reading the response.
