import { INodeWithServices } from './i-node-with-services';
import { Dictionnary } from 'arrayplus';
import { IServiceConstraint } from './i-service-constraint';

export interface IService {
    name: string;
    ports: { [key: number]: number };
    nodes: INodeWithServices[];
    virtualIPs: Dictionnary<string, string>;
    constraints: IServiceConstraint[];
}