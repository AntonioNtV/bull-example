import express from 'express';
import cron from 'node-cron';
import { UI } from 'bull-board';
import routes from './routes/index';
import BullQueueProvider from './providers/implementations/BullQueueProvider/BullQueueProvider';
import SendStudentToProcessWorker from './workers/SendStudentToProcessWorker';
import ProcessStudentWorker from './workers/ProcessStudentWorker';

class App {
    public express: express.Application;

    public queueProvider: BullQueueProvider;

    constructor() {
        this.express = express();
        this.queueProvider = new BullQueueProvider();
        this.initialization();
    }

    private defineCron(): void {
        cron.schedule('* * * * *', async () =>
            this.queueProvider.add({
                key: 'send-student-to-process',
            }),
        );
    }

    private initialization(): void {
        this.middlewares();
        this.routes();
        this.database();
        this.workers();
        this.defineCron();
    }

    private middlewares(): void {
        this.express.use(express.json());
        this.express.use('/admin/queues', UI);
    }

    private workers(): void {
        this.queueProvider.register({
            key: 'send-student-to-process',
            handle: SendStudentToProcessWorker,
        });

        this.queueProvider.register({
            key: 'process-students',
            handle: ProcessStudentWorker,
        });

        this.queueProvider.process();
        this.queueProvider.bullUISetQueues();
    }

    private routes(): void {
        this.express.use(routes);
    }

    private database(): void {
        console.log('conecting to database');
    }
}

const app = new App();
const application = app.express;
const { queueProvider } = app;

export { application, queueProvider };
