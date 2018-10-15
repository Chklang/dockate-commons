import { INodeWithServices } from './i-node-with-services';
import { Dictionnary } from 'arrayplus';

export interface IService {
    NAME: string;
    PORT: { [key: number]: number };
    domains: string[];
    paths: string[];
    authent: string[];
    nodes: INodeWithServices[];
    virtualIPs: Dictionnary<string, string>;
}