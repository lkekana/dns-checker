import { getOS, OS } from "../environment";
import { runCommand } from "../cmd";
import type { Test, TestState } from "../teststates";
import { useState } from "react";
import { decodeB64Packet } from "../lib/packet";

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
const SUCCESS_THRESHOLD = 0.7;

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
            return Promise.allSettled(
                DNS_SERVERS.map(async (server) => {
                    const cmd = `./web/helpers/dist/tls -d "example.com" -s ${server}`;
                    console.log(cmd);
                    console.log(`Running DoT test using server ${server}...`);
                    return runCommand(cmd);
                }),
            )
                .then((results) => {
                    console.log(`Results: ${results.map((r) => r.status)}`);
                    let fulfilled = 0;
                    for (const r of results) {
                        if (r.status === "rejected") {
                            console.error(`Error: ${r.reason}`);
                            // setState("failure");
                            // return;
                            continue;
                        }
                        const result = decodeB64Packet(r.value);
                        if (result.type !== 'response') {
                            console.error("Error: result is not a response");
                            // setState("failure");
                            // return;
                            continue;
                        }
                        if (result.answers?.length === 0) {
                            console.error("Error: result has no answers");
                            // setState("failure");
                            // return;
                            continue;
                        }
                        fulfilled++;
                    }
                    if (fulfilled >= DNS_SERVERS.length * SUCCESS_THRESHOLD) {
                        setState("success");
                    } else {
                        setState("failure");
                    }
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
