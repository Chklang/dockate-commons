import { INodeWithServices } from './i-node-with-services';
import { IService } from './i-service';
import { Dictionnary } from 'arrayplus';

export interface IGlobalDB {
    nodes: INodeWithServices[];
    services: Dictionnary<string, IService>;
}