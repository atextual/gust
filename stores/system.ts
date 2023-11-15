import { fetch } from "@tauri-apps/api/http";
import { getSampleData, getFormattedZoneKey } from "@/utils";
import { AirconState, type SystemConfig, ZoneInfo } from "@/types";

export const useSystemStore = defineStore("system", {
  state: () => ({
    usingDummyData: false,
    config: null as SystemConfig | null,
    selectedAirconId: "ac1",
    systemMessage: "",
    messageTimeoutId: null as NodeJS.Timeout | null,
  }),

  getters: {
    getState: (state) =>
      state.config?.aircons[state.selectedAirconId]?.info?.state,
    getMode: (state) =>
      state.config?.aircons[state.selectedAirconId]?.info?.mode,
    getFanSpeed: (state) =>
      state.config?.aircons[state.selectedAirconId]?.info?.fan,
    getZones: (state) =>
      state.config?.aircons[state.selectedAirconId]?.zones || {},
    getZoneById: (state) => {
      return (zoneId: string | number) => {
        const airconId = state.selectedAirconId;
        const myZoneKey = getFormattedZoneKey(
          state.config?.aircons[airconId]?.info.myZone,
        );
        const zoneKey = getFormattedZoneKey(zoneId);
        return state.config?.aircons[airconId] &&
          state.config?.aircons[airconId].zones
          ? state.config?.aircons[airconId].zones[
              zoneKey === "myZone" ? myZoneKey : zoneKey
            ]
          : {};
      };
    },
    hasTemperatureSensors: (state) =>
      Object.values(state.getZones).some((zone) => zone.setTemp !== null),
    getSelectedSystem: (state) => state.config?.aircons[state.selectedAirconId],
  },

  actions: {
    updateSystemIpAddress(ipAddress: string | null) {
      this.systemIpAddress = ipAddress;
    },

    updateAirconInfo(
      airconId: string,
      newInfo: Partial<ZoneInfo | AirconState>,
    ) {
      if (this.config?.aircons[airconId]) {
        this.config.aircons[airconId].info = {
          ...this.config.aircons[airconId].info,
          ...newInfo,
        };
      }
    },

    updateZoneInfo(
      airconId: string,
      zoneKey: string,
      newInfo: Partial<ZoneInfo>,
    ) {
      if (this.config?.aircons[airconId]?.zones[zoneKey]) {
        this.config.aircons[airconId].zones[zoneKey] = {
          ...this.config.aircons[airconId].zones[zoneKey],
          ...newInfo,
        };
      }
    },
    async useDummyData() {
      if (this.usingDummyData) return;
      this.usingDummyData = true;
      this.config = getSampleData();
      this.updateSystemMessage(
        "Cannot find MyAir5 device, loading demo mode",
        1500,
      );
    },
    async fetchSystemData() {
      const networkStore = useNetworkStore();
      try {
        const response = await fetch(
          `http://${networkStore.systemIpAddress}:${networkStore.scanPort}/getSystemData`,
        );
        if (!response.ok) throw new Error("Failed to fetch system data");
        this.config = { ...this.config, ...response.data };
        this.usingDummyData = false;
      } catch (error) {
        this.useDummyData();
      }
    },
    updateSystemMessage(newMessage: string, timeout = 3000) {
      clearTimeout(this.messageTimeoutId);
      this.systemMessage = newMessage;
      this.messageTimeoutId = setTimeout(
        () => this.resetSystemMessage(),
        timeout,
      );
    },
    resetSystemMessage() {
      this.systemMessage = "";
      clearTimeout(this.messageTimeoutId);
      this.messageTimeoutId = null;
    },
  },
});
