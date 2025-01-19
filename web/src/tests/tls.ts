import { getOS, OS } from "../environment";
import { runCommand } from "../cmd";
import type { Test, TestState } from "../teststates";
import { useState } from "react";
import { decodeB64Packet } from "./https";

const DNS_SERVERS = [
    // Google Public DNS
    "8.8.8.8",
    "8.8.4.4",

    // Cloudflare DNS
    "1.1.1.1",
    "1.0.0.1",

    // Adguard DNS
    "94.140.14.14",
    "94.140.15.15",

    // OpenDNS
    "208.67.222.222",
    "208.67.220.220",

    // Yandex DNS
    "77.88.8.8",
    "77.88.8.1",
];

/*
const initialTests: Test[] = [
    { testName: 'Traditional DNS', state: 'success', runTest: runTLSTest },
    { testName: 'DNS over HTTPS (DoH)', state: 'failure', runTest: () => false },
    { testName: 'DNS over TLS (DoT)', state: 'pending', runTest: () => false },
    { testName: 'DNSCrypt (443)', state: 'success', runTest: () => true },
    { testName: 'DNSCrypt (5353)', state: 'failure', runTest: () => false },
    { testName: 'DNSCrypt (53)', state: 'pending', runTest: () => false },
    { testName: 'ODoH (443)', state: 'success', runTest: () => true },
];
*/

export const useTLSTest = (): Test => {
    const [state, setState] = useState<TestState>("not run");
    const [testHasRun, setTestHasRun] = useState<boolean>(false);

    console.log({ state, testHasRun });

    const runTLSTest = async () => {
        setState("pending");
        setTestHasRun(true);
        const OStype = await getOS();
        if (OStype === OS.macOS) {
            // macOS
            return Promise.all(
                DNS_SERVERS.map(async (server) => {
                    const cmd = `./web/helpers/dist/tls -d "example.com" -s ${server}`;
                    console.log(cmd);
                    console.log(`Running DoT test using server ${server}...`);
                    return runCommand(cmd);
                }),
            )
                .then((results) => {
                    console.log(`Results: ${results}`);
                    const decodedPackets = results.map((result) => decodeB64Packet(result));
                    console.log(decodedPackets);
                    for (const result of decodedPackets) {
                        if (result.type !== 'response') {
                            console.error("Error: result is not a response");
                            setState("failure");
                            return;
                        }
                        if (result.answers?.length === 0) {
                            console.error("Error: result has no answers");
                            setState("failure");
                            return;
                        }
                    }
                    setState("success");
                })
                .catch((error) => {
                    console.error(`Error: ${error}`);
                    setState("failure");
                });
        }

        if (OStype === OS.Windows) {
            // Windows
        }

        if (OStype === OS.Linux) {
            // Linux
        }
    };

    return {
        testName: "DNS over TLS (DoT)",
        state,
        testHasRun,
        runTest: runTLSTest,
    };
};
