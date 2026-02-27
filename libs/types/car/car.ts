import { CarFuelType, CarLocation, CarStatus, CarType } from '../../enums/car.enum';
import { Member } from '../member/member';

export interface MeLiked {
	memberId: string;
	likeRefId: string;
	myFavorite: boolean;
}

export interface TotalCounter {
	total: number;
}

export interface Car {
	_id: string;
	carType: CarType;
	carStatus: CarStatus;
	carLocation: CarLocation;
	carMileage: number;
 // carAddress: string;
	carTitle: string;
	carPrice: number;

	carFuelType: CarFuelType;
 // carSquare: number;
	carBeds: number;
	carRooms: number;

	carViews: number;
	carLikes: number;
	carComments: number;
	carRank: number;
	carImages: string[];
	carDesc?: string;
	carBarter: boolean;
	carRent: boolean;
	memberId: string;
	soldAt?: Date;
	deletedAt?: Date;
	constructedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation **/
	meLiked?: MeLiked[];
	memberData?: Member;
}

export interface Cars {
	list: Car[];
	metaCounter: TotalCounter[];
}
