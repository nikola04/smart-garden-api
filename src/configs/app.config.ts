const config = {
    maxUserProjects: 5,
    maxProjectDevices: 10,
    reportIntervalS: 60, // in seconds
    sensors: {
        light: {
            threshold: 50
        }
    }
};

export type AppConfig = typeof config;
export default config;
