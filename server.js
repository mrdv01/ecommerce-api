import http from 'http';
import app from './app/app.js';

//create server
const server = http.createServer(app);
const PORT = process.env.PORT || 2024
server.listen(PORT, console.log(`server is up and running on port ${PORT}`)); 