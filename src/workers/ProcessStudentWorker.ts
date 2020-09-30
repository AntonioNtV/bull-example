import { Job, DoneCallback } from 'bull';

export default async function (job: Job, done: DoneCallback): Promise<void> {
    try {
        const { studentName, studentToken } = job.data.data.data;

        console.log('PROCESSING STUDENT');

        console.log(studentName, studentToken);
        done();
    } catch (err) {
        done(err);
    }
}
