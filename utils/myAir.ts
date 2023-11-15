import { AirconState, AirconMode, ZoneState, FanSpeed } from "@/types";
import { fetch } from "@tauri-apps/api/http";

const constructUrl = (ipAddress: string, jsonPayload: object): string => {
  if (ipAddress) {
    return `http://${ipAddress}:2025/setAircon?json=${encodeURIComponent(
      JSON.stringify(jsonPayload),
    )}`;
  } else {
    return null;
  }
};

const debounce = (func: (...args: any[]) => any, wait: number) => {
  let timeout: ReturnType<typeof setTimeout> | null;
  return (...args: any[]): Promise<any> => {
    return new Promise((resolve) => {
      clearTimeout(timeout);
      timeout = setTimeout(async () => {
        const result = await func(...args);
        resolve(result);
      }, wait);
    });
  };
};

const callApi = (url: string): Promise<any> => {
  if (!url) return;
  return fetch(url);
};

const debouncedCallApi = debounce(callApi, 300);

const setAirconState = (
  ipAddress: string,
  airconId: string,
  state: AirconState,
): Promise<any> => {
  const payload = {
    [airconId]: {
      info: {
        state,
      },
    },
  };
  const url = constructUrl(ipAddress, payload);
  return debouncedCallApi(url);
};

const setAirconMode = (
  ipAddress: string,
  airconId: string,
  mode: AirconMode,
): Promise<any> => {
  const payload = {
    [airconId]: {
      info: {
        mode,
      },
    },
  };
  const url = constructUrl(ipAddress, payload);
  return debouncedCallApi(url);
};

const setAirconTemperature = (
  ipAddress: string,
  airconId: string,
  temperature: number,
): Promise<any> => {
  if (temperature < 16 || temperature > 32) {
    throw new Error("Temperature must be between 16 and 32 degrees.");
  }

  const payload = {
    [airconId]: {
      info: {
        setTemp: temperature,
      },
    },
  };
  const url = constructUrl(ipAddress, payload);
  return debouncedCallApi(url);
};

const setAirconFanSpeed = (
  ipAddress: string,
  airconId: string,
  fanSpeed: FanSpeed,
): Promise<any> => {
  const payload = {
    [airconId]: {
      info: {
        fan: fanSpeed,
      },
    },
  };
  const url = constructUrl(ipAddress, payload);
  return debouncedCallApi(url);
};

const setAirconPriorityZone = (
  ipAddress: string,
  airconId: string,
  zoneNumber: number,
): Promise<any> => {
  const payload = {
    [airconId]: {
      info: {
        myZone: zoneNumber,
      },
    },
  };
  const url = constructUrl(ipAddress, payload);
  return debouncedCallApi(url);
};

const setZoneState = (
  ipAddress: string,
  airconId: string,
  zoneId: string,
  state: ZoneState,
): Promise<any> => {
  const payload = {
    [airconId]: {
      zones: {
        [zoneId]: {
          state,
        },
      },
    },
  };
  const url = constructUrl(ipAddress, payload);
  return debouncedCallApi(url);
};

const setZoneTemperature = (
  ipAddress: string,
  airconId: string,
  zoneId: string,
  temperature: number,
): Promise<any> => {
  if (temperature < 16 || temperature > 32) {
    throw new Error(
      `setTemp must be between 16 and 32. Received: ${temperature}`,
    );
  }
  const payload = {
    [airconId]: {
      zones: {
        [zoneId]: {
          setTemp: temperature,
        },
      },
    },
  };
  const url = constructUrl(ipAddress, payload);
  return debouncedCallApi(url);
};

const setZoneValue = (
  ipAddress: string,
  airconId: string,
  zoneId: string,
  step: number,
): Promise<any> => {
  if (step < 0 || step > 100) {
    throw new Error(`Value must be between 0 and 100. Received: ${step}`);
  }
  const payload = {
    [airconId]: {
      zones: {
        [zoneId]: {
          value: step,
        },
      },
    },
  };
  const url = constructUrl(ipAddress, payload);
  return debouncedCallApi(url);
};

export {
  constructUrl,
  callApi,
  setAirconMode,
  setAirconTemperature,
  setAirconState,
  setAirconFanSpeed,
  setAirconPriorityZone,
  setZoneState,
  setZoneValue,
  setZoneTemperature,
};
