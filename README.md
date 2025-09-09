SpecDocManager (Angular + Express)

Dev
- API: npm run dev (serves on http://127.0.0.1:5000)
- Client: cd client-angular; npm start (http://localhost:4200, /api proxied)

Prod
- cd client-angular; npm run build
- npm run start (Express serves Angular dist)

Notes
- Previous React/Vite client has been removed.