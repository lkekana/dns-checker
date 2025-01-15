import { getOS, OS } from '../environment';
import { runCommand } from '../cmd';
import type { Test, TestState } from '../teststates';
import { useState } from 'react';

const DNS_SERVERS = [
    '8.8.8.8',
];

/*
const initialTests: Test[] = [
    { testName: 'Traditional DNS', state: 'success', runTest: runTraditionalDNSTest },
    { testName: 'DNS over HTTPS (DoH)', state: 'failure', runTest: () => false },
    { testName: 'DNS over TLS (DoT)', state: 'pending', runTest: () => false },
    { testName: 'DNSCrypt (443)', state: 'success', runTest: () => true },
    { testName: 'DNSCrypt (5353)', state: 'failure', runTest: () => false },
    { testName: 'DNSCrypt (53)', state: 'pending', runTest: () => false },
    { testName: 'ODoH (443)', state: 'success', runTest: () => true },
];
*/

export const useTraditionalTest = (): Test => {
    const [state, setState] = useState<TestState>('not run');
    const [testHasRun, setTestHasRun] = useState<boolean>(false);

    console.log({ state, testHasRun });

    const runTraditionalDNSTest = async () => {
        setState('pending');
        setTestHasRun(true);
        const OStype = await getOS();
        if (OStype === OS.macOS) {
            // macOS
            return Promise.all(DNS_SERVERS.map(async (server) => {
                const cmd = `dig @${server} example.com | jc --dig`;
                console.log(cmd);
                console.log(`Running traditional DNS test using server ${server}...`);
                return runCommand(cmd);
            }))
            .then((results) => {
                console.log(`Results: ${results}`);
                setState('success');
            })
            .catch((error) => {
                console.error(`Error: ${error}`);
                setState('failure');
            });
        }
    
        if (OStype === OS.Windows) {
            // Windows
        }
    
        if (OStype === OS.Linux) {
            // Linux
        }
    };

    console.log({ testName: 'Traditional DNS', state, testHasRun, runTest: runTraditionalDNSTest });
    return { testName: 'Traditional DNS', state, testHasRun, runTest: runTraditionalDNSTest };
};