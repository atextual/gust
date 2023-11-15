import { getFormattedZoneKey } from "@/utils";
import {
  setAirconState,
  setAirconMode,
  setAirconTemperature,
  setAirconFanSpeed,
  setAirconPriorityZone,
  setZoneState,
  setZoneValue,
  setZoneTemperature,
} from "@/utils/myAir";
import {
  type AirconState,
  type AirconMode,
  type ZoneState,
  type FanSpeed,
  type ZoneInfo,
} from "@/types";

export const useControlStore = defineStore("control", {
  actions: {
    async setZoneState(
      airconId: string,
      zoneId: number | string,
      newState: ZoneState,
    ) {
      const systemStore = useSystemStore();
      const zoneKey = getFormattedZoneKey(zoneId);
      const prevState = systemStore.getZoneById(zoneKey)?.state;
      systemStore.updateZoneInfo(airconId, zoneKey, { state: newState });

      try {
        await setZoneState(
          systemStore.systemIpAddress!,
          airconId,
          zoneKey,
          newState,
        );
      } catch (error) {
        systemStore.updateZoneInfo(airconId, zoneKey, { state: prevState });
        throw error;
      }
    },

    async setZoneValue(
      airconId: string,
      zoneId: number | string,
      direction: number,
    ) {
      const systemStore = useSystemStore();
      const networkStore = useNetworkStore();

      const zoneKey = getFormattedZoneKey(zoneId);
      const zoneInfo = systemStore.getZoneById(zoneKey);
      if (!zoneInfo && zoneKey) {
        throw new Error(`Zone with ID ${zoneId} not found.`);
      }

      const isTemperatureControlled = systemStore.hasTemperatureSensors;
      const stepSize = isTemperatureControlled ? 1 : 5;
      const keyToUpdate = isTemperatureControlled ? "setTemp" : "value";
      const prevValue = Number(zoneInfo[keyToUpdate]);
      const newValue = prevValue + direction * stepSize;

      systemStore.updateZoneInfo(airconId, zoneKey, {
        [keyToUpdate]: newValue,
      });

      try {
        if (
          isTemperatureControlled &&
          !zoneInfo &&
          networkStore.systemIpAddress
        ) {
          await setAirconTemperature(
            systemStore.systemIpAddress!,
            airconId,
            zoneKey,
            newValue,
          );
        } else if (isTemperatureControlled) {
          await setZoneTemperature(
            systemStore.systemIpAddress!,
            airconId,
            zoneKey,
            newValue,
          );
        } else {
          await setZoneValue(
            systemStore.systemIpAddress!,
            airconId,
            zoneKey,
            newValue,
          );
        }
      } catch (error) {
        systemStore.updateZoneInfo(airconId, zoneKey, {
          [keyToUpdate]: prevValue,
        });
        throw error;
      }
    },

    async setSystemControl(
      airconId: string,
      control: string,
      newValue: AirconState | AirconMode | number | FanSpeed,
    ) {
      const systemStore = useSystemStore();

      const selectedSystem = systemStore.getSelectedSystem;
      if (!selectedSystem) {
        throw new Error(`Aircon with ID ${airconId} not found.`);
      }
      const prevState = selectedSystem.info[control];
      systemStore.updateAirconInfo(airconId, { [control]: newValue });

      try {
        switch (control) {
          case "state":
            await setAirconState(
              systemStore.systemIpAddress!,
              airconId,
              newValue as AirconState,
            );
            break;
          case "mode":
            await setAirconMode(
              systemStore.systemIpAddress!,
              airconId,
              newValue as AirconMode,
            );
            break;
          case "setTemp":
            await setAirconTemperature(
              systemStore.systemIpAddress!,
              airconId,
              newValue as number,
            );
            break;
          case "fan":
            await setAirconFanSpeed(
              systemStore.systemIpAddress!,
              airconId,
              newValue as FanSpeed,
            );
            break;
          case "myZone":
            await setAirconPriorityZone(
              systemStore.systemIpAddress!,
              airconId,
              newValue as number,
            );
            break;
          default:
            throw new Error("Invalid control");
        }
      } catch (error) {
        systemStore.updateAirconInfo(airconId, { [control]: prevState });
        throw error;
      }
    },
  },
});
