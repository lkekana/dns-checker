import { app, computer, os, events } from '@neutralinojs/lib';
import { getOS, OS } from '../environment';
import { runCommand } from '../cmd';

export const runTraditionalDNSTest = async (): Promise<boolean> => {
    const OStype = await getOS();
    if (OStype === OS.macOS) {
        // macOS

        const cmd = `dig @${'8.8.8.8'} example.com | jc --dig`;
        console.log(cmd);
        console.log('Running traditional DNS test...');
        const output = await runCommand(cmd);
        console.log(`Output (length=${output.length}): ${output}`);
        // const digProc = await os.spawnProcess(cmd);
        // let digStdOut = '';
        // let digStdErr = '';
        // events.on('spawnedProcess', (evt) => {
        //     if(digProc.id === evt.detail.id) {
        //         switch(evt.detail.action) {
        //             case 'stdOut':
        //                 console.log(evt.detail.data);
        //                 digStdOut += evt.detail.data;
        //                 break;
        //             case 'stdErr':
        //                 console.error(evt.detail.data);
        //                 digStdErr += evt.detail.data;
        //                 break;
        //             case 'exit':
        //                 console.log(`Dig process terminated with exit code: ${evt.detail.data}`);

        //                 break;
        //         }
        //     }
        // });
    }
    else if (OStype === OS.Windows) {
        // Windows
    }
    else if (OStype === OS.Linux) {
        // Linux
    }
    return true;
}