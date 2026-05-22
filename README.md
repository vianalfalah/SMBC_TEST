The provided API/documentation endpoint was unavailable during development, so I implemented a mock REST API using json-server to demonstrate full CRUD functionality and Redux state management.

## Start Project

### Install dependencies
yarn install

### Run dev project
yarn dev

## Mock API

### Run project and json-server

Open two terminal

Terminal 1:
```bash
yarn dev
```

Terminal 2:
```bash
npx json-server --watch db.json --port 3001
```