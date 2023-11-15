import {
  getInterfaces,
  scanLocalNetworkOnlineHostsByPort,
} from "tauri-plugin-network-api";

export const useNetworkStore = defineStore("network", {
  state: () => ({
    userIpAddress: null,
    systemIpAddress: null,
    userPollingInterval: 2048,
    systemDataPollingInterval: 5120,
    scanPort: 2025,
    userPollingIntervalId: null,
    systemDataPollingIntervalId: null,
  }),

  actions: {
    async findUserIpAddress() {
      const interfaces = await getInterfaces();
      this.userIpAddress =
        interfaces
          .find((iface) => iface.v4_addrs.some((addr) => !addr.is_internal))
          ?.v4_addrs.find((addr) => !addr.is_internal)?.ip || null;
    },

    async searchDevicesAndLoadConfig() {
      const systemStore = useSystemStore();
      const onlineHosts = await scanLocalNetworkOnlineHostsByPort(
        this.scanPort,
      );

      if (onlineHosts.length > 0) {
        const newIpAddress = onlineHosts[0].ip;
        if (newIpAddress !== this.systemIpAddress) {
          this.systemIpAddress = newIpAddress;
        }
        systemStore.updateSystemIpAddress(this.systemIpAddress);
        this.startSystemDataPolling();
      } else {
        this.handleNoDevicesFound();
      }
    },

    async handleNoDevicesFound() {
      const systemStore = useSystemStore();
      if (this.systemIpAddress) {
        this.systemIpAddress = null;
      } else if (!systemStore.getSelectedSystem) {
        systemStore.updateSystemMessage(
          "No system found on network. Loading demo mode.",
          1000,
        );
      }
      this.stopSystemDataPolling();
      await systemStore.useDummyData();
    },

    startPolling() {
      this.stopPolling();
      this.userPollingIntervalId = setInterval(() => {
        this.findUserIpAddress();
        this.searchDevicesAndLoadConfig();
      }, this.userPollingInterval);
    },

    async startSystemDataPolling() {
      const systemStore = useSystemStore();
      if (!this.systemDataPollingIntervalId) {
        systemStore.updateSystemMessage(
          "MyAir5 system found! Connecting",
          1000,
        );
        await systemStore.fetchSystemData();
        this.systemDataPollingIntervalId = setInterval(() => {
          this.pollSystemData();
        }, this.systemDataPollingInterval);
      }
    },

    stopSystemDataPolling() {
      clearInterval(this.systemDataPollingIntervalId);
      this.systemDataPollingIntervalId = null;
    },

    stopPolling() {
      clearInterval(this.userPollingIntervalId);
      this.userPollingIntervalId = null;
      this.stopSystemDataPolling();
    },

    async pollSystemData() {
      const systemStore = useSystemStore();
      if (this.systemIpAddress && !systemStore.usingDummyData) {
        await systemStore.fetchSystemData();
      }
    },
  },
});
