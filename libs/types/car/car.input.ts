import { CarFuelType, CarLocation, CarStatus, CarType } from '../../enums/car.enum';
import { Direction } from '../../enums/common.enum';

export interface CarInput {
	carType: CarType;
	carLocation: CarLocation;
	carMileage: number;
	carTitle: string;
	carPrice: number;

	// carSquare: number;
	carFuelType: CarFuelType;
	carEngine: number;
	// carRooms: number;
	carDoors: number;

	carImages: string[];
	carDesc?: string;
	carBarter?: boolean;
	carRent?: boolean;
	memberId?: string;
	constructedAt?: Date;
}

interface PISearch {
	memberId?: string;
	locationList?: CarLocation[];
	typeList?: CarType[];
	roomsList?: Number[];
	options?: string[];
	bedsList?: Number[];
	pricesRange?: Range;
	periodsRange?: PeriodsRange;
	squaresRange?: Range;
	text?: string;
}

export interface CarsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: PISearch;
}

interface APISearch {
	carStatus?: CarStatus;
}

export interface AgentCarsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: APISearch;
}

interface ALPISearch {
	carStatus?: CarStatus;
	carLocationList?: CarLocation[];
}

export interface AllCarsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: ALPISearch;
}

interface Range {
	start: number;
	end: number;
}

interface PeriodsRange {
	start: Date | number;
	end: Date | number;
}
