# Sorting Game

Colour and shape sorting game built for the Unify Services coding test.

## Stack

- Frontend: React + Vite + TypeScript
- Backend: Node.js + TypeScript
- Database: PostgreSQL
- Infrastructure: Docker + Docker Compose
- Frontend state management: TODO
- Testing: TODO

## Why This Stack

React + Vite + TypeScript was chosen for the frontend because it provides a fast development workflow, strong TypeScript support, and a straightforward component model for building the drag-and-drop game UI.

Node.js + TypeScript was chosen for the backend because it keeps the frontend and backend in the same language family, reduces context switching, and works well for the required REST API, validation, PostgreSQL integration, and automated tests.

## Product Behaviour

The app is a colour and shape sorting game. A player starts a game, drags items into matching colour or shape buckets, and finishes when all items are correctly sorted. The fastest completion time is the best score.

Required behaviour:
- Minimum 10 sortable items
- Shapes: triangle, square, circle
- Colours: red, green, blue
- Correct drops stay in the bucket
- Incorrect drops return to the unsorted area
- Timer starts when the game starts
- Well Done modal appears on completion
- Progress persists in Local Storage
- Best score persists in PostgreSQL
- Game sessions/scores are shareable

## Running the Project

TODO

## Docker

TODO

## Migrations

TODO

## Tests

TODO

## API Endpoints

TODO

Expected endpoints:
- `GET /health`
- `GET /api/best-score`
- `POST /api/best-score`
- `GET /api/games`
- `POST /api/games`
- `GET /api/games/:id`
- `PATCH /api/games/:id`
- `DELETE /api/games/:id`

## Database Schema

TODO

Expected tables:
- `scores`
- `games`

## State Management

TODO

## Debugging

TODO

Debug screenshots should be stored in `docs/`.

## Tradeoffs and Limitations

TODO

