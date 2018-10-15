import * as minimist from "minimist";

export interface IConfiguration {
    swarmHost: string;
    swarmPortHTTP: number;
    swarmPortSSH: number;
    swarmUsername: string;
    swarmPassword: string;
    intervalBetweenCheckServices: number;
}

export class Configuration {
    private static _instance: Configuration = null;
    public static get INSTANCE(): Configuration {
        if (Configuration._instance === null) {
            Configuration._instance = new Configuration();
        }
        return Configuration._instance;
    }

    private args: { [key: string]: string } = null;
    private confEntries: IConfigurationEntry[] = [
        { name: "swarmHost", mandatory: true, type: EType.STRING },
        { name: "swarmPortHTTP", mandatory: true, type: EType.NUMBER },
        { name: "swarmPortSSH", mandatory: true, type: EType.NUMBER },
        { name: "swarmUsername", mandatory: true, type: EType.STRING },
        { name: "swarmPassword", mandatory: true, type: EType.STRING },
        { name: "intervalBetweenCheckServices", mandatory: true, type: EType.NUMBER }
    ];

    public getConfig<T extends IConfiguration>(): Promise<T> {
        try {
            this.checkConf();
        } catch (e) {
            return Promise.reject(e);
        }
        const result: any = {};
        this.confEntries.forEach((entry) => {
            switch (entry.type) {
                case EType.STRING:
                    result[entry.name] = this.getEnvVariable(entry.name);
                    break;
                case EType.NUMBER:
                    result[entry.name] = Number(this.getEnvVariable(entry.name));
                    break;
                case EType.BOOLEAN:
                    result[entry.name] = this.getEnvVariable(entry.name) === "true";
                    break;
            }
        });

        return Promise.resolve(result as T);
    }

    public addConfigEntries(entries: IConfigurationEntry[]): void {
        entries.forEach((entry) => {
            this.confEntries.push(entry);
        });
    }

    private checkConf(): void {
        const errors: string[] = this.checkConfEntries(this.confEntries.filter(p => p.mandatory === true).map(p => p.name));
        if (errors.length > 0) {
            throw new Error('Variables not detected : "' + errors.join('", "') + '"');
        }
    }

    public checkConfEntries(entries: string[]): string[] {
        const errors: string[] = [];
        entries.forEach((entry) => {
            if (!this.getEnvVariable(entry)) {
                errors.push('dockerproxy.' + entry);
            }
        });
        return errors;
    }

    public getEnvVariable(name: string): string {
        if (!this.args) {
            this.args = minimist.default(process.argv);
        }
        if (this.args.dockerproxy) {
            const proxyconf: { [key: string]: string } = this.args.dockerproxy as any;
            if (proxyconf[name]) {
                return '' + proxyconf[name];
            }
        }
        return process.env['dockerproxy.' + name];
    }
}

export enum EType {
    STRING, NUMBER, BOOLEAN
}

export interface IConfigurationEntry {
    name: string;
    mandatory: boolean;
    type: EType;
}
