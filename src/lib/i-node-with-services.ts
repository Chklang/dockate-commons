import { IService } from './i-service';

export interface INodeWithServices {
    ID: string;
    NAME: string;
    IP: string;
    SERVICES: IService[];
}