import { app, computer, os, events } from '@neutralinojs/lib';

type CommandOutput = {
    type: 'stdOut' | 'stdErr';
    data: string;
};

export const runCommand = async (command: string): Promise<string> => {
    const proc = await os.spawnProcess(command);
    const output: CommandOutput[] = [];
    return new Promise((resolve, reject) => {
        const handleEvent = (evt: CustomEvent) => {
            if (proc.id === evt.detail.id) {
                switch (evt.detail.action) {
                    case 'stdOut': {
                        // console.log(evt.detail.data);
                        // console.log(`#${evt.detail.data}#`);
                        output.push({ type: 'stdOut', data: (evt.detail.data as string).trim()});
                        break;
                    }
                    case 'stdErr': {
                        console.error(evt.detail.data);
                        // output.push({ type: 'stdErr', data: (evt.detail.data as string).trim()});
                        break;
                    }
                    case 'exit': {
                        console.log(`Process terminated with exit code: ${evt.detail.data}`);
                        events.off('spawnedProcess', handleEvent);
                        // const finalOutput = output.map((o) => {
                        //     if (o.type === 'stdOut') {
                        //         // return `OUT: ${o.data}`;
                        //         return o.data;
                        //     }
                        //     return `ERR: ${o.data}`;
                        // }).join('\n');
                        const finalOutput = output.map((o) => o.data).join('\n');
                        if (evt.detail.data === 0) {
                            resolve(finalOutput);
                        } else {
                            reject(new Error(`Process exited with code ${evt.detail.data}: ${finalOutput}`));
                        }
                        break;
                    }
                }
            }
        };
        events.on('spawnedProcess', handleEvent);
    });
};