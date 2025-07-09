# Software Requirements Specification (SRS)  
## IoT Sensor Data Collection and Analytics Application

### 1. Introduction

This application allows users to collect, monitor, and analyze sensor data from multiple microcontroller devices across different projects. Each project can have up to five devices that upload periodic sensor readings. Users can view live data, historical analytics, and manage project and device settings.

### 2. Overall Description

#### 2.1 Project Structure
- Users create **Projects** which serve as containers for data collection.  
- Each project can contain multiple **Devices** (microcontrollers), with a maximum of 5 per project.  
- Each device uploads sensor data such as temperature, soil moisture, light intensity, battery level, and charging status.

#### 2.2 Key Features
- Dashboard displaying key device statuses and recent sensor data.  
- Analytics section providing historical data visualizations with customizable filters.  
- Project Settings to manage project metadata and user access.  
- Device Management with API key generation and device-specific settings.  
- Sensor Control allowing enabling/disabling individual sensors per device.  
- Offline Live Data viewing by pairing microcontrollers directly (e.g., via Bluetooth) with a phone.

### 3. Functional Requirements

#### 3.1 Dashboard
- Display battery status for each device.  
- Show sensor data (temperature, soil moisture, light) for the last 24 hours.  
- Provide a health log summarizing device status and alerts.

#### 3.2 Analytics
- Display historical sensor data graphs with the following filters:  
  - **Devices**: Checklist to select one or multiple devices.  
  - **Data Interval (granularity)**:  
    - **Hour**: Default last 24 hours, average data for every 30 minutes across selected devices.  
    - **Day**: Default last 30 days, average data per day.  
    - **Month**: Default last 12 months, average data per month.  
  - **Period**: Duration of data displayed based on selected interval:  
    - For Hour interval: options are 12h, 24h, 36h, 72h.  
    - For Day interval: options are 7d, 14d, 30d.  
    - For Month interval: options are 6m, 12m, 24m.  
- Provide an option to export data (e.g., CSV, JSON).

#### 3.3 Project Settings
- Allow renaming of a project.  
- Allow deletion of a project.  
- Allow adding other users as visitors with limited access.

#### 3.4 Device Management
- Add new devices to a project (up to 5 devices).  
- For each device:  
  - Configure device-specific settings.  
  - Generate and manage API keys for secure device communication.

#### 3.5 Sensor Management
- For each device, list available sensors.  
- Allow enabling or disabling individual sensors.

#### 3.6 Live Data Viewing (Offline Mode)
- Support pairing a microcontroller device directly with a smartphone (e.g., via Bluetooth).  
- Display real-time sensor data on the smartphone without requiring internet connectivity.

### 4. Non-Functional Requirements

- The system shall support multiple concurrent users.  
- Data uploads from devices shall be secure via API keys.  
- The UI shall be responsive and accessible on both desktop and mobile browsers.  
- Analytics queries should return results within reasonable response times (< 500ms for typical queries).  
- The system shall store sensor data efficiently for up to 24 months.

### 5. Assumptions and Dependencies

- Microcontroller devices can connect via the internet to upload data using generated API keys.  
- Bluetooth or similar local connectivity is available for offline live data viewing.  
- Users have stable internet access for regular data upload and analytics usage.
