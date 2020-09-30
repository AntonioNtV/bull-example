import { Job } from 'bull';

interface IQueueProvider {
    empty(): Promise<void>;
    clean(time: number, failed: boolean): Promise<void>;
    add({ name, data, opts }: Job): Promise<void>;
    process(): Promise<void>;
}

export default IQueueProvider;
