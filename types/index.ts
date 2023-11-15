export const AirconStates = {
  on: true,
  off: true,
} as const;

export const AirconModes = {
  cool: true,
  heat: true,
  vent: true,
  dry: true,
} as const;

export const ZoneStates = {
  open: true,
  closed: true,
} as const;

export const FanSpeeds = {
  low: true,
  medium: true,
  high: true,
  auto: true,
} as const;

export const TempControls = {
  myZone: true,
  myTemp: true,
  myAuto: true,
} as const;

export type AirconState = keyof typeof AirconStates;
export type AirconMode = keyof typeof AirconModes;
export type ZoneState = keyof typeof ZoneStates;
export type FanSpeed = keyof typeof FanSpeeds;
export type TempControl = keyof typeof TempControls;

export interface AirconPayload {
  state?: AirconState;
  mode?: AirconMode;
  fan?: FanSpeed;
  setTemp?: number;
  myZone?: number;
}

export interface ZonePayload {
  state?: ZoneState;
  setTemp?: number;
  value?: number;
}

export interface AirconInfo {
  constant1: number;
  constant2: number;
  constant3: number;
  countDownToOff: number;
  countDownToOn: number;
  fan: FanSpeed;
  freshAirStatus: string;
  mode: AirconMode;
  myZone: number;
  name: string;
  setTemp: number;
  state: AirconState;
}

export interface ZoneInfo {
  name: string;
  setTemp: number;
  state: ZoneState;
  type: number;
  value: number;
}

export interface AirconConfig {
  info: AirconInfo;
  zones: Record<string, ZoneInfo>;
}

export interface SystemConfig {
  aircons: Record<string, AirconConfig>;
  system: {
    name: string;
    needsUpdate: boolean;
    noOfAircons: number;
  };
}
