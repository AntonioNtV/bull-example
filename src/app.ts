import express from 'express';
import cron from 'node-cron';
import routes from './routes/index';
import IQueueProvider from './providers/IQueueProvider';
import BullQueueProvider from './providers/implementations/BullQueueProvider/BullQueueProvider';

class App {
    public express: express.Application;

    public queueProvider: IQueueProvider;

    constructor() {
        this.express = express();
        this.queueProvider = new BullQueueProvider();
        this.initialization();
        this.defineCron();
    }

    private defineCron() {
        const sendToProcessQueue = this.queueProvider.getQueue(
            'send_student_to_process',
        );
        cron.schedule('* * * * *', async () =>
            sendToProcessQueue.bull.add('process_students'),
        );
    }

    private initialization(): void {
        this.middlewares();
        this.routes();
        this.database();
    }

    private middlewares(): void {
        this.express.use(express.json());
    }

    private routes(): void {
        this.express.use(routes);
    }

    // eslint-disable-next-line class-methods-use-this
    private database(): void {
        console.log('conecting to database');
    }
}

const app = new App();
const application = app.express;
const { queueProvider } = app;

export { application, queueProvider };
