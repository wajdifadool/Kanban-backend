# Kanban Board - Backend

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This repository contains the backend services for a comprehensive, Trello-like Kanban board system. It is designed to provide all server-side functionality, including real-time collaboration, robust authentication, and a detailed API for managing boards, lists, and cards.

This project is built based on the detailed **Software Requirements Specification (SRS) v1.0**.

## ✨ Key Features

- **Core Kanban Functionality:** Full CRUD operations for Boards, Lists, and Cards.
- **Real-Time Collaboration:** Instant updates for all connected clients via WebSockets (e.g., card moves, new comments).
- **User & Team Management:** User authentication (Email/Password, Google/GitHub OAuth), organizations, and teams.
- **Rich Card Details:** Support for descriptions, comments, checklists, labels, due dates, attachments, and member assignments.
- **Permissions:** Robust Role-Based Access Control (RBAC) at the organization and board levels (Owner, Admin, Member, Observer).
- **Activity & Notifications:** In-app notifications and a detailed activity stream for all board and card actions.
- **Powerful Search:** Full-text search across cards, boards, and comments with filtering.
- **Integrations:** Extensible system with support for Webhooks for third-party services.
- **Attachments:** Secure file uploads to S3-compatible object storage with pre-signed URLs.

---

## 🏗️ System Architecture & Tech Stack

This backend is designed as a set of services (modular monolith or microservices) to ensure separation of concerns and scalability.

- **High-Level Architecture:**

  - **API Gateway:** Routes external traffic to the appropriate services.
  - **Auth Service:** Handles all authentication, token issuance (JWT), and OAuth flows.
  - **Core Service:** Manages the primary business logic for boards, lists, and cards.
  - **Attachment Service:** Manages file uploads and S3 integration.
  - **Realtime Service:** Manages WebSocket connections and presence.
  - **Search Service:** Interfaces with OpenSearch for indexing and querying.
  - **Event Bus (Kafka/RabbitMQ):** Connects services for asynchronous, event-driven communication (e.g., `CardMoved`, `CommentAdded`).

- **Core Technologies:**
  - **Primary Database:** MongoDB
  - **Caching & Locks:** ( suggestsion) Redis
  - **Search Index:** ( suggestsion) OpenSearch / Elasticsearch
  - **Message Broker:** ( suggestsion) Kafka or RabbitMQ
  - **Object Storage:** ( suggestsion) S3 (or compatible)
  - **Real-time:** ( suggestsion) WebSockets (WSS)
  - **Authentication:** JSON Web Tokens (JWT), oauth 2.0

---

## 🚀 Getting Started

### Prerequisites

To run this project locally, you will need the following services running:

- [Node.js](https://nodejs.org/)
- A package manager (`npm`,)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/wajdifadool/Kanban-backend.git
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configuration:**
    - Create environment file `/config/.env` and add the follwoing :
      ```bash
      PORT
      NODE_ENV
      MONGO_URI
      JWT_SECRET
      JWT_EXPIRE
      JWT_COOKIE_EXPIRE
      FILE_UPLOAD_PATH
      FILE_UPLOAD_MAX
      ```

### Running the Application

1.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The server will start, typically on `http://localhost:{{PORT}}`.

---

## 🧪 Running Tests

This project uses **Jest** and for testing, with separate configurations for **unit tests** and **lifecycle tests**.

### Test Setup Overview

- **Unit Tests**: cover individual functions or modules in isolation.

- **Lifecycle Tests**: cover the full flow of a modules, (e.g., users, boards, cards).

- **Setup config**: We use a `mongodb-memory-server` for local MongoDB server for our tests

---

### Available Test Commands

#### 1. **Run All Tests**

```bash
npm run test            # all tests
npm run test:unit       # unit testing
npm run test:lifecycle  # lifecycle testing
npm run test:lifecycle:single <file_path>  # single lifecycle testing
npm run test:unit:single  <file_path> # single unit testing
```

## 📖 API Documentation

The API is versioned under `/api/v1/.` All endpoints (unless public) require an Authorization: `Bearer <token>` header.

```
add OpenAPI for api docs
```
