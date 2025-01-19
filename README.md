# API Documentation

## User Endpoints

### 1. Register User

**Endpoint:** `POST /user/register`

**Description:** Registers a new user.

**Request Body:**

```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "birthDate": "DD-MM-YYYY"
}
```

**Response:**

- `201 Created`

```json
{
  "message": "success register customer",
  "data": {
    "name": "string",
    "email": "string"
  }
}
```

- `500 Internal Server Error`

```json
{
  "error": "string"
}
```

### 2. Login User

**Endpoint:** `POST /user/login`

**Description:** Logs in a user and returns an access token.

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**

- `200 OK`

```json
{
  "access_token": "string",
  "email": "string",
  "username": "string"
}
```

- `401 Unauthorized`

```json
{
  "error": "Invalid email/password"
}
```

### 3. Get All Users

**Endpoint:** `GET /user`

**Description:** Fetches all users (requires authentication).

**Response:**

- `200 OK`

```json
[
  {
    "id": "number",
    "name": "string",
    "email": "string",
    "birthDate": "YYYY-MM-DD",
    "lastActive": "YYYY-MM-DDTHH:mm:ss.sssZ"
  }
]
```

- `500 Internal Server Error`

```json
{
  "error": "string"
}
```

---

## Rule Endpoints

### 1. Create Rule

**Endpoint:** `POST /rule`

**Description:** Creates a new rule.

**Request Body:**

```json
{
  "name": "string",
  "condition": "object",
  "actions": ["string"],
  "isActive": "boolean (optional)"
}
```

**Response:**

- `200 OK`

```json
{
  "message": "Success create rule",
  "data": {
    "id": "number",
    "name": "string",
    "condition": "object",
    "actions": ["string"],
    "isActive": "boolean",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

- `400 Bad Request`

```json
{
  "error": "Invalid data format"
}
```

- `500 Internal Server Error`

```json
{
  "error": "string"
}
```

### 2. Get All Rules

**Endpoint:** `GET /rule`

**Description:** Fetches all rules.

**Response:**

- `200 OK`

```json
[
  {
    "id": "number",
    "name": "string",
    "condition": "object",
    "actions": ["string"],
    "isActive": "boolean",
    "createdAt": "string",
    "updatedAt": "string"
  }
]
```

- `500 Internal Server Error`

```json
{
  "error": "string"
}
```

### 3. Send Email

**Endpoint:** `POST /rule/send-email`

**Description:** Sends an email using RabbitMQ.

**Request Body:**

```json
{
  "id": "number",
  "email": "string",
  "name": "string"
}
```

**Response:**

- `200 OK`

```json
{
  "message": "Email sent successfully"
}
```

- `500 Internal Server Error`

```json
{
  "error": "string"
}
```

### 4. Send Notification

**Endpoint:** `POST /rule/send-notification`

**Description:** Sends a notification using RabbitMQ.

**Request Body:**

```json
{
  "userId": "number",
  "name": "string"
}
```

**Response:**

- `200 OK`

```json
{
  "message": "Notification sent successfully"
}
```

- `500 Internal Server Error`

```json
{
  "error": "string"
}
```

---

## Rule Scheduler

### Description

The Rule Scheduler processes scheduled tasks to handle dormant users and users with birthdays. It evaluates user data against defined rules and executes actions like sending emails or notifications.

### 1. Process Dormant Users

**Purpose:** Identifies users who have been inactive for 90 days and executes the defined rule actions.

**Logic:**

- Fetch users with `lastActive` date older than 90 days.
- Check if the users meet the rule condition.
- Perform actions such as sending emails or notifications based on the rule.

### 2. Process Birthday Users

**Purpose:** Identifies users whose birthday is today and executes the defined rule actions.

**Logic:**

- Fetch users with `birthDate` matching today’s date.
- Check if the users meet the rule condition.
- Perform actions such as sending birthday emails or notifications.

### 3. Scheduler Start

**Description:** Initializes the scheduler to run daily at a specified time.

**Implementation:**

- Converts the time to a cron expression.
- Schedules tasks to process dormant and birthday users based on defined rules.

---

## Consumers

### Email Consumer

**Description:** Processes email messages from the `email_queue`.

**Logic:**

- Listens for messages in the `email_queue`.
- Sends emails based on the message payload.
- Logs success or errors during processing.

### Notification Consumer

**Description:** Processes notification messages from the `notif_queue`.

**Logic:**

- Listens for messages in the `notif_queue`.
- Sends notifications based on the message payload.
- Logs success or errors during processing.
