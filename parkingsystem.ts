enum VehicleType {
    Car,
    Bike,
    Truck
}

class Vehicle {
    type: VehicleType;
    licensePlate: string;

    constructor(type: VehicleType, licensePlate: string) {
        this.type = type;
        this.licensePlate = licensePlate;
    }
}

class ParkingSlot {
    level: number;
    slotNumber: number;
    vehicle: Vehicle | null;

    constructor(level: number, slotNumber: number) {
        this.level = level;
        this.slotNumber = slotNumber;
        this.vehicle = null;
    }

    isAvailable(): boolean {
        return this.vehicle === null;
    }

    parkVehicle(vehicle: Vehicle): void {
        if (!this.isAvailable()) {
            throw new Error('Parking slot is already occupied.');
        }
        this.vehicle = vehicle;
    }

    removeVehicle(): Vehicle | null {
        const vehicle = this.vehicle;
        this.vehicle = null;
        return vehicle;
    }
}

class Level {
    levelNumber: number;
    slots: ParkingSlot[];

    constructor(levelNumber: number, numOfSlots: number) {
        this.levelNumber = levelNumber;
        this.slots = [];
        for (let i = 0; i < numOfSlots; i++) {
            this.slots.push(new ParkingSlot(levelNumber, i + 1));
        }
    }

    findAvailableSlot(): ParkingSlot | null {
        for (const slot of this.slots) {
            if (slot.isAvailable()) {
                return slot;
            }
        }
        return null;
    }

    parkVehicle(vehicle: Vehicle): boolean {
        const slot = this.findAvailableSlot();
        if (slot) {
            slot.parkVehicle(vehicle);
            return true;
        }
        return false;
    }

    unparkVehicle(licensePlate: string): Vehicle | null {
        for (const slot of this.slots) {
            if (slot.vehicle && slot.vehicle.licensePlate === licensePlate) {
                return slot.removeVehicle();
            }
        }
        return null;
    }
}

class ParkingLot {
    levels: Level[];

    constructor(numOfLevels: number, slotsPerLevel: number) {
        this.levels = [];
        for (let i = 0; i < numOfLevels; i++) {
            this.levels.push(new Level(i + 1, slotsPerLevel));
        }
    }

    parkVehicle(vehicle: Vehicle): boolean {
        for (const level of this.levels) {
            if (level.parkVehicle(vehicle)) {
                console.log(`Vehicle parked at level ${level.levelNumber}`);
                return true;
            }
        }
        console.log('Parking lot is full');
        return false;
    }

    unparkVehicle(licensePlate: string): Vehicle | null {
        for (const level of this.levels) {
            const vehicle = level.unparkVehicle(licensePlate);
            if (vehicle) {
                console.log(`Vehicle with license plate ${licensePlate} unparked from level ${level.levelNumber}`);
                return vehicle;
            }
        }
        console.log('Vehicle not found in the parking lot');
        return null;
    }

    getAvailableSlots(): number {
        let count = 0;
        for (const level of this.levels) {
            for (const slot of level.slots) {
                if (slot.isAvailable()) {
                    count++;
                }
            }
        }
        return count;
    }
}

const parkingLot = new ParkingLot(3, 10); 

const car = new Vehicle(VehicleType.Car, 'ABC123');
const bike = new Vehicle(VehicleType.Bike, 'XYZ789');

parkingLot.parkVehicle(car); 
parkingLot.parkVehicle(bike); 

console.log('Available slots:', parkingLot.getAvailableSlots()); 

parkingLot.unparkVehicle('ABC123'); 

console.log('Available slots:', parkingLot.getAvailableSlots());
