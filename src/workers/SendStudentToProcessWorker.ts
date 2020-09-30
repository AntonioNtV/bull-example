import { DoneCallback, Job } from 'bull';
import { queueProvider } from '../app';
import studentsArray from '../studentsData';

export default async function (job: Job, done: DoneCallback): Promise<void> {
    try {
        for (const student of studentsArray) {
            console.log(`Adding student ${student.name}`);

            const jobData = {
                data: {
                    studentName: student.name,
                    studentToken: student.token,
                },
            } as Job;

            queueProvider.add({
                key: 'process-students',
                job: jobData,
            });
        }
        done();
    } catch (err) {
        done(err);
    }
}
