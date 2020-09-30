import Bull from 'bull';

class BasicQueue {
    public name: string;

    public bull: Bull.Queue;

    public processPath: string;

    constructor(name: string, processPath: string) {
        this.name = name;
        this.bull = new Bull(name);
        this.processPath = processPath;
    }
}

export default BasicQueue;
