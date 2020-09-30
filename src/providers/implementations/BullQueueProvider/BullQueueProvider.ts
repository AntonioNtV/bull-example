import { Job } from 'bull';
import IQueueProvider from '../../IQueueProvider';
import BasicQueue from './BasicQueue';

class BullQueueProvider implements IQueueProvider {
    private queues: BasicQueue[];

    constructor() {
        this.queues = [];
        this.queues.push(new BasicQueue('teste', ''));
    }

    public async empty(): Promise<void> {
        await Promise.all(
            this.queues.map(async queue => {
                await queue.bull.empty();
            }),
        );
    }

    public async clean(time: number, failed: boolean): Promise<void> {
        this.queues.forEach(queue => {
            if (failed) {
                queue.bull.clean(time);
            }
            queue.bull.clean(time, 'failed');
        });
    }

    public async add({ name, data, opts }: Job): Promise<void> {
        const queue = this.queues.find(q => q.name === name);

        if (!queue) {
            throw new Error('Worker not found');
        }
        await queue.bull.add({ data }, opts);
    }

    public async process(): Promise<void> {
        this.queues.forEach(queue => {
            queue.bull.process(queue.processPath);
            queue.bull.on('failed', (job, err) => {
                console.log(queue.name, JSON.stringify(err));
            });
        });
    }
}

export default BullQueueProvider;
