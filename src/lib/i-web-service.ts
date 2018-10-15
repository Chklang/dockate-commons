import { IConfigurationEntry } from './config';
import { IGlobalDB } from './i-global-db';

export interface IWebService {
    getConfEntries(): IConfigurationEntry[];
    stop(): Promise<void>;
    updateConf(db: IGlobalDB): Promise<void>;
}
