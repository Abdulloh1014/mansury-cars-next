import { CarLocation, CarStatus, CarType } from '../../enums/car.enum';

export interface CarUpdate {
	_id: string;
	carType?: CarType;
	carStatus?: CarStatus;
	carLocation?: CarLocation;
	carAddress?: string;
	carTitle?: string;
	carPrice?: number;
	carSquare?: number;
	carBeds?: number;
	carRooms?: number;
	carImages?: string[];
	carDesc?: string;
	carBarter?: boolean;
	carRent?: boolean;
	soldAt?: Date;
	deletedAt?: Date;
	constructedAt?: Date;
}
