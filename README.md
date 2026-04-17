# Hospital Cath Lab Medical Items Management

Clean full-stack project with a rebuilt backend and a single React UI module for medical item management.

## Tech Stack

- Backend: Node.js + Express.js
- Database: MongoDB + Mongoose
- Frontend: React (Vite)

## New Project Structure

```text
cathlab system/
  backend/
    config/
      db.js
    models/
      MedicalItem.js
    controllers/
      itemController.js
    routes/
      itemRoutes.js
    middleware/
      errorHandler.js
    .env.example
    server.js
    package.json
  frontend/
    src/
      App.jsx
      index.css
      main.jsx
    .env.example
    package.json
  package.json
```

## Medical Item Model Fields

- `itemName` (required)
- `itemCode` (required, unique)
- `category` (required)
- `quantity` (required, number >= 0)
- `unitPrice` (required, number >= 0)
- `supplier` (optional)
- `expiryDate` (optional)
- `description` (optional)
- `createdAt` / `updatedAt` (auto from Mongoose timestamps)

## API Endpoints

- `POST /api/items` -> add new item
- `GET /api/items` -> get all items
- `GET /api/items/:id` -> get single item
- `PUT /api/items/:id` -> update item
- `DELETE /api/items/:id` -> delete item

## Environment Files

### `backend/.env`

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/cathlab_medical_items
```

### `frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:5000
```

## Dependencies

### Backend

- `express`
- `mongoose`
- `cors`
- `dotenv`
- `nodemon` (dev)

### Frontend

- `react`
- `react-dom`
- `vite`

### Root

- `concurrently` (run backend and frontend together)

## Exact Commands to Run

### 1) Backend

```powershell
cd "c:\Users\lahiruni kavindya\Desktop\cathlab system\backend"
copy .env.example .env
npm install
npm run dev
```

### 2) Frontend

```powershell
cd "c:\Users\lahiruni kavindya\Desktop\cathlab system\frontend"
copy .env.example .env
npm install
npm run dev
```

### 3) Run Both from Root (optional)

```powershell
cd "c:\Users\lahiruni kavindya\Desktop\cathlab system"
npm install
npm run dev
```

## Frontend Module Features

- One clean medical item management page
- Add form with all fields
- Items table
- Edit and Delete actions
- Search bar
- Success and error messages
- Responsive professional hospital-style UI
