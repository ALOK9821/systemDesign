interface Location {
  latitude: number;
  longitude: number;
}

class Driver {
  constructor(
    public id: string,
    public name: string,
    public location: Location,
    public isAvailable: boolean
  ) {}
}

class Rider {
  constructor(
    public id: string,
    public name: string,
    public location: Location
  ) {}
}

class Ride {
  constructor(
    public id: string,
    public driverId: string,
    public riderId: string,
    public startLocation: Location,
    public endLocation: Location,
    public status:
      | "requested"
      | "accepted"
      | "in_progress"
      | "completed"
      | "cancelled"
  ) {}
}

function calculateDistance(loc1: Location, loc2: Location): number {
  const latDiff = loc1.latitude - loc2.latitude;
  const longDiff = loc1.longitude - loc2.longitude;
  return Math.sqrt(latDiff * latDiff + longDiff * longDiff);
}

function findNearestDriver(rider: Rider, drivers: Driver[]): Driver | null {
  let nearestDriver: Driver | null = null;
  let minDistance = Infinity;

  for (const driver of drivers) {
    if (driver.isAvailable) {
      const distance = calculateDistance(rider.location, driver.location);
      if (distance < minDistance) {
        minDistance = distance;
        nearestDriver = driver;
      }
    }
  }

  return nearestDriver;
}

class RideSharingService {
  private drivers: Map<string, Driver> = new Map();
  private riders: Map<string, Rider> = new Map();
  private rides: Map<string, Ride> = new Map();

  addDriver(driver: Driver) {
    this.drivers.set(driver.id, driver);
  }

  addRider(rider: Rider) {
    this.riders.set(rider.id, rider);
  }

  requestRide(riderId: string, endLocation: Location): Ride | null {
    const rider = this.riders.get(riderId);
    if (!rider) {
      throw new Error("Rider not found");
    }

    const nearestDriver = findNearestDriver(
      rider,
      Array.from(this.drivers.values())
    );
    if (!nearestDriver) {
      return null; // No available driver found
    }

    const ride = new Ride(
      Math.random().toString(36).substring(7),
      nearestDriver.id,
      rider.id,
      rider.location,
      endLocation,
      "requested"
    );

    this.rides.set(ride.id, ride);
    nearestDriver.isAvailable = false;
    return ride;
  }

  cancelRide(rideId: string): void {
    const ride = this.rides.get(rideId);
    if (!ride) {
      throw new Error("Ride not found");
    }

    if (ride.status === "completed" || ride.status === "cancelled") {
      throw new Error("Cannot cancel a completed or already cancelled ride");
    }

    ride.status = "cancelled";
    const driver = this.drivers.get(ride.driverId);
    if (driver) {
      driver.isAvailable = true;
    }
  }

  completeRide(rideId: string): void {
    const ride = this.rides.get(rideId);
    if (!ride) {
      throw new Error("Ride not found");
    }

    if (ride.status !== "in_progress") {
      throw new Error("Cannot complete a ride that is not in progress");
    }

    ride.status = "completed";
    const driver = this.drivers.get(ride.driverId);
    if (driver) {
      driver.isAvailable = true;
    }
  }

  startRide(rideId: string): void {
    const ride = this.rides.get(rideId);
    if (!ride) {
      throw new Error("Ride not found");
    }

    if (ride.status !== "requested") {
      throw new Error("Ride is not in a state to start");
    }

    ride.status = "in_progress";
  }
}
const service = new RideSharingService();

const driver1 = new Driver(
  "d1",
  "Driver 1",
  { latitude: 40.7128, longitude: -74.006 },
  true
);
const driver2 = new Driver(
  "d2",
  "Driver 2",
  { latitude: 40.7127, longitude: -74.0059 },
  true
);
const rider = new Rider("r1", "Rider 1", {
  latitude: 40.7126,
  longitude: -74.0061,
});

service.addDriver(driver1);
service.addDriver(driver2);
service.addRider(rider);

const ride = service.requestRide("r1", {
  latitude: 40.7125,
  longitude: -74.0062,
});
if (ride) {
  console.log("Ride requested:", ride);
  service.startRide(ride.id);
  console.log("Ride started:", ride);
  service.completeRide(ride.id);
  console.log("Ride completed:", ride);
} else {
  console.log("No drivers available");
}
