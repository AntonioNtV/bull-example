import Bull, { DoneCallback, Job } from 'bull';
import { setQueues } from 'bull-board';

interface IQueue {
    bull: Bull.Queue;
    key: string;
    handle: (job: Job, done: DoneCallback) => Promise<void>;
}

interface IAddQueue {
    key: string;
    handle: (job: Job, done: DoneCallback) => Promise<void>;
}

interface IAddJob {
    key: string;
    job?: Job;
}
class BullQueueProvider {
    private queues: IQueue[];

    constructor() {
        this.queues = [];
    }

    public async empty(): Promise<void> {
        await Promise.all(
            this.queues.map(async queue => {
                await queue.bull.empty();
            }),
        );
    }

    public bullUISetQueues(): void {
        setQueues(this.queues.map(q => q.bull));
    }

    public async clean(time: number, failed: boolean): Promise<void> {
        this.queues.forEach(queue => {
            if (failed) {
                queue.bull.clean(time);
            }
            queue.bull.clean(time, 'failed');
        });
    }

    public register({ key, handle }: IAddQueue): void {
        this.queues.push({
            bull: new Bull(key),
            handle,
            key,
        });
    }

    public async add({ key, job }: IAddJob): Promise<void> {
        const queue = this.queues.find(q => q.key === key);

        if (!queue) {
            throw new Error('Queue not registered');
        }

        queue.bull.add({ data: job });
    }

    public async process(): Promise<void> {
        this.queues.forEach(queue => {
            queue.bull.process(queue.handle);
            queue.bull.on('failed', (job, err) => {
                console.log(queue.key, JSON.stringify(err));
            });
        });
    }
}

export default BullQueueProvider;
