# IoT Sensor Data Backend

## Overview
This backend service collects, stores, and serves sensor data from multiple microcontroller devices (e.g., ESP32). It supports device management, API key authentication, and provides data analytics endpoints.

## Features
- Manage multiple projects and devices per user
- Secure API key generation and validation for devices
- Store sensor readings: temperature, soil moisture, light, battery status, charging state
- Query historical data with aggregation (hourly, daily, monthly averages)
- Export data in CSV/JSON formats
- User and project settings management

## Technology Stack
- Node.js with TypeScript on Express.js framework
- MongoDB for data storage
- JWT or API key-based authentication

## API Report Endpoint
`POST /report` — Upload sensor data

## Setup & Run
#### 1. Install dependencies:  
```bash
npm install
```

#### 2. For development:

- Start development server with environment variables from `.development.env`:  
    ```bash
    npm run dev
    ```

- Start development server in watch mode (auto-reload on file changes):  
    ```bash
    npm run dev:watch
    ```

#### 3. To build the production-ready code (TypeScript compilation):  
```bash
npm run build
```

#### 4. To start the production server with environment variables from `.production.env`:  
```bash
npm start
```

#### 5. Linting commands:  
- Check code for lint errors:  
    ```bash
    npm run lint
    ```
- Automatically fix lint errors where possible:  
    ```bash
    npm run lint:fix
    ```
