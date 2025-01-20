import { getOS, OS } from "../environment";
import { runCommand } from "../cmd";
import type { Test, TestState } from "../teststates";
import { useState } from "react";
import { decodeB64Packet } from "../lib/packet";

type ODoHPair = {
    resolver: string;
    proxy: string;
};

const DNS_SERVERS: ODoHPair[] = [
    {
        resolver: "https://odoh.cloudflare-dns.com",
        proxy: "https://ibksturm.synology.me/proxy",
    }
];
const SUCCESS_THRESHOLD = 0.7;

export const useObliviousTest = (): Test => {
    const [state, setState] = useState<TestState>("not run");
    const [testHasRun, setTestHasRun] = useState<boolean>(false);

    console.log({ state, testHasRun });

    const runObliviousTest = async () => {
        setState("pending");
        setTestHasRun(true);
        const OStype = await getOS();
        if (OStype === OS.macOS) {
            // macOS
            return Promise.allSettled(
                DNS_SERVERS.map(async (server) => {
                    const cmd = `./web/helpers/odoh-client-rs/target/debug/odoh-client-rs -t "${server.resolver}" -p "${server.proxy}" "example.com"`;
                    console.log(cmd);
                    console.log(`Running Oblivious DoH (ODoH) test using resolver '${server.resolver}' and proxy '${server.proxy}'...`);
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
                        try {
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
                        catch (error) {
                            console.error(`Error: ${error}`);
                            // setState("failure");
                            // return;
                            continue;
                        }
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
        testName: "ODoH (443)",
        state,
        testHasRun,
        runTest: runObliviousTest,
    };
};
