import { DoneCallback, Job } from 'bull';

const process = async (job: Job, done: DoneCallback): Promise<void> => {
    try {
        const { studentName, studentToken } = job.data;

        console.log('PROCESSING STUDENT');

        console.log(studentName, studentToken);
    } catch (err) {
        done(err);
    }
};

const processStudentsWorkerPath = __filename;
export { processStudentsWorkerPath };
export default process;
