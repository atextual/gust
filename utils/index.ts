const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const roomNames = [
  "Living Room",
  "Kitchen",
  "Master Bedroom",
  "Guest Bedroom",
  "Bathroom",
  "Dining Room",
  "Office",
  "Kids Room",
  "Garage",
  "Basement",
  "Attic",
  "Hallway",
  "Sunroom",
  "Laundry Room",
  "Pantry",
  "Entryway",
  "Library",
  "Home Theater",
  "Gym",
  "Playroom",
];

// Helper function to generate a random zone
const generateZone = (zoneNumber: number, useTemperatureControl: boolean) => {
  const state = "open"; // Assume all zones are open for this example
  const type = useTemperatureControl ? randomInt(1, 3) : 0;
  const setTemp = useTemperatureControl ? randomInt(16, 32) : null;
  const value = !useTemperatureControl ? randomInt(1, 20) * 5 : null;
  const measuredTemp = useTemperatureControl ? randomInt(16, 32) : null;
  const roomName = roomNames[randomInt(0, roomNames.length - 1)]; // Select a random room name

  return {
    name: roomName,
    setTemp, // Only exists if the system uses temperature control
    state,
    type,
    value, // Only exists if the system uses percentage control
    measuredTemp,
    number: zoneNumber,
  };
};

// Sample data generation function
const generateSampleData = (useTemperatureControl: boolean) => {
  // Generate a random number of zones
  const zones: any = {};
  const noOfZones = randomInt(4, 16);

  for (let i = 1; i <= noOfZones; i++) {
    const zoneKey = `z${i.toString().padStart(2, "0")}`;
    zones[zoneKey as string] = generateZone(i, useTemperatureControl);
  }

  // Select a random zone to be the priority zone (myZone) if using temperature control
  const myZone = useTemperatureControl ? randomInt(1, noOfZones) : 0;

  // Generate the aircon info
  const airconInfo = {
    constant1: 1,
    constant2: 2,
    constant3: 0,
    countDownToOff: randomInt(0, 720),
    countDownToOn: randomInt(0, 720),
    fan: ["low", "medium", "high", "auto"][randomInt(0, 3)],
    freshAirStatus: ["on", "off"][randomInt(0, 1)],
    mode: ["heat", "cool", "vent", "dry"][randomInt(0, 3)],
    myZone,
    name: "AirconHome",
    setTemp: !useTemperatureControl ? randomInt(16, 32) : null, // setTemp is null if not using temperature control
    state: ["on", "off"][randomInt(0, 1)],
  };

  // Generate the system info
  const systemInfo = {
    name: "MyPlaceSystem",
    needsUpdate: false,
    noOfAircons: 1,
  };

  // Combine everything into the sample data structure
  return {
    aircons: {
      ac1: {
        info: airconInfo,
        zones,
      },
    },
    system: systemInfo,
  };
};

// Define an array of sample data sets with alternating control types
const sampleDataSets = [
  generateSampleData(true), // Temperature-controlled zones
  generateSampleData(false), // Percentage-controlled zones
  generateSampleData(true), // Temperature-controlled zones
  generateSampleData(false), // Percentage-controlled zones
];

const getSampleData = () => {
  const randomIndex = Math.floor(Math.random() * sampleDataSets.length);
  return sampleDataSets[randomIndex];
};

const getFormattedZoneKey = (zoneId: number | string) => {
  return typeof zoneId === "number"
    ? `z${zoneId.toString().padStart(2, "0")}`
    : zoneId;
};

export { getSampleData, getFormattedZoneKey };
