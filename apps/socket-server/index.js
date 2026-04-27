const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const registeredVehicles = {};

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('vehicle:register', (data) => {
    registeredVehicles[data.vehicleId] = data;
    io.emit('vehicle:registered', data);
  });

  socket.on('vehicle:request_info', (vehicleId) => {
    if (registeredVehicles[vehicleId]) {
      socket.emit('vehicle:info', registeredVehicles[vehicleId]);
    } else {
      socket.emit('vehicle:info', { vehicleId, error: "Vehicle not found", notFound: true });
    }
  });

  socket.on('vehicle:update', (data) => {
    // Broadcast vehicle updates to all connected clients (especially admin dashboard)
    io.emit('vehicle:update', data);
  });

  socket.on('vehicle:command', (data) => {
    // Broadcast commands to all connected clients (especially driver app)
    io.emit('vehicle:command', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Socket.io server listening on port ${PORT}`);
});
