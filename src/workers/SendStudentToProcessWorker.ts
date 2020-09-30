import { DoneCallback } from 'bull';
import { queueProvider } from '../app';
import studentsArray from '../studentsData';

export default async function (done: DoneCallback): Promise<void> {
    console.log('STUDENTS');
    console.log(studentsArray);

    try {
        const queue = queueProvider.getQueue('process_student_queue');
        for (const student of studentsArray) {
            console.log(`Adding student ${student.name}`);

            await queue.bull.add(student.name, {
                studentName: student.name,
                studentToken: student.token,
            });
        }
        done();
    } catch (err) {
        done(err);
    }
}

const sendStudentToProcessWorkerPath = __filename;
export { sendStudentToProcessWorkerPath };
