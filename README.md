# Contacts

A clean address book application built with React, Redux Toolkit, React Router, and Tailwind CSS.

## Architecture

- **Retrieval (GET)**: Fetches paginated lists and initial data from the public [RandomUser API](https://randomuser.me/api).
- **Local CRUD (Create, Update, Delete)**: Since the public API is read-only, all write operations are managed entirely client-side using **Redux Toolkit** in-memory state.

## Getting Started

### 1. Install Dependencies
```bash
yarn install
```

### 2. Run the Development Server
```bash
yarn dev
```

### 3. Run Unit Tests
```bash
yarn test
```