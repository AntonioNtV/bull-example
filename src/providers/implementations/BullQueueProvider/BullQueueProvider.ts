import { processStudentsWorkerPath } from '../../../workers/ProcessStudentWorker';
import { sendStudentToProcessWorkerPath } from '../../../workers/SendStudentToProcessWorker';
import IQueueProvider from '../../IQueueProvider';
import BasicQueue from './BasicQueue';

class BullQueueProvider implements IQueueProvider {
    private queues: BasicQueue[];

    constructor() {
        this.queues = [];
        this.queues.push(
            new BasicQueue(
                'send_student_to_process',
                sendStudentToProcessWorkerPath,
            ),
        );
        this.queues.push(
            new BasicQueue('process_student_queue', processStudentsWorkerPath),
        );

        this.process();
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

    public getQueue(name: string): BasicQueue {
        const queue = this.queues.find(q => q.name === name);

        if (!queue) {
            throw new Error('Worker not found');
        }

        return queue;
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
