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
            return Promise.all(
                DNS_SERVERS.map(async (server) => {
                    const cmd = `./web/helpers/odoh-client-rs/target/debug/odoh-client-rs -t "${server.resolver}" -p "${server.proxy}" "example.com"`;
                    console.log(cmd);
                    console.log(`Running Oblivious DoH (ODoH) test using resolver '${server.resolver}' and proxy '${server.proxy}'...`);
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
        testName: "ODoH (443)",
        state,
        testHasRun,
        runTest: runObliviousTest,
    };
};
