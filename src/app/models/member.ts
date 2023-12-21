import { Photo } from "./photo";


export interface Member {
    id: number;
    userName: any;
    photoUrl: any;
    age: number;
    knownAs: string;
    created: Date;
    lastActive: Date;
    gender: string;
    introduction: string;
    lookingFor: string;
    interests: string;
    city: string;
    country: string;
    photos: Photo[]
}