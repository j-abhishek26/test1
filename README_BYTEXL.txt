QUESTION 15 — UPDATED TO MATCH YOUR BYTE XL FOLDER STRUCTURE

Your existing layout:
my-project/
  client/
  models/
  routes/
  .env
  index.js
  package.json

This ZIP uses that layout. It keeps the Express backend at the project root and React inside client/.

1) Extract/copy these files into your existing my-project folder. If asked, replace the sample index.js,
   package.json, models/Project.js and routes/projectRoutes.js with these versions. Keep your own .env
   and never share it.

2) In the root my-project terminal:
     npm install

3) Make sure the root .env contains:
     MONGO_URI=your_real_mongodb_connection_string
     PORT=5000

   Do not include quotes unless needed. Do not commit .env to Git.

4) Start backend in terminal 1 (root folder):
     npm start
   Test:
     http://localhost:5000/api/health

5) Open a second terminal and go into client:
     cd client
     npm install

6) Create client/.env with:
     VITE_API_URL=http://localhost:5000/api

7) Start React:
     npm run dev
   Open the URL shown by Vite (usually http://localhost:5173).

IMPORTANT BYTE XL NOTES
- Backend and frontend must run at the same time, in separate terminals.
- If ByteXL gives the frontend a remote preview URL, localhost may not reach the backend from that preview.
  In that case deploy/expose the backend and set VITE_API_URL to the reachable backend URL.
- MongoDB Atlas needs a database user and an allowed IP/network setting.
- The API supports GET /api/projects, GET /api/projects/:id, POST /api/projects,
  PUT /api/projects/:id and DELETE /api/projects/:id.
- The React UI lets you add projects, list projects, open project details, and delete projects.
- For Git part (c), run commands from the project root:
     git switch main
     git pull origin main
     git switch -c feature/project-details
     git add .
     git commit -m "Add project management feature"
     git push -u origin feature/project-details
     git switch main
     git merge feature/project-details
     git push origin main
  If the remote default branch is master, replace main with master.
