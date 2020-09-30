import BasicQueue from './implementations/BullQueueProvider/BasicQueue';

interface IQueueProvider {
    empty(): Promise<void>;
    clean(time: number, failed: boolean): Promise<void>;
    process(): Promise<void>;
    getQueue(name: string): BasicQueue;
}

export default IQueueProvider;
