import { CarColor, CarFuelType, CarLocation, CarStatus, CarType } from '../../enums/car.enum';

export interface CarUpdate {
	_id: string;
	carType?: CarType;
	carStatus?: CarStatus;
	carLocation?: CarLocation;
	carMileage?: number;
	carTitle?: string;
	carPrice?: number;

	// carSquare: number;
	carFuelType?: CarFuelType;
	// carBeds: number;
	carEngine?: number;
	// carRooms: number;
	carDoors?: number;
	// new
	carYear?: number;
	carColor?: CarColor

	carImages?: string[];
	carDesc?: string;
	carBarter?: boolean;
	carRent?: boolean;
	soldAt?: Date;
	deletedAt?: Date;
	constructedAt?: Date;
}
