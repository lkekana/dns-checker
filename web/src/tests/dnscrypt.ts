import { getOS, OS } from "../environment";
import { runCommand } from "../cmd";
import type { Test, TestState } from "../teststates";
import { useState } from "react";
import { JSONMsg } from "../lib/dnslookup_types";

type DNSCryptPair = {
    name: string;
    sdns_stamp: string;
    port: string;
};

const DNS_SERVERS: DNSCryptPair[] = [
   {
        name: "adguard-dns",
        sdns_stamp: "sdns://AQMAAAAAAAAAETk0LjE0MC4xNC4xNDo1NDQzINErR_JS3PLCu_iZEIbq95zkSV2LFsigxDIuUso_OQhzIjIuZG5zY3J5cHQuZGVmYXVsdC5uczEuYWRndWFyZC5jb20",
        port: "5443",
    },

    {
        name: "cisco",
        sdns_stamp: "sdns://AQEAAAAAAAAADjIwOC42Ny4yMjAuMjIwILc1EUAgbyJdPivYItf9aR6hwzzI1maNDL4Ev6vKQ_t5GzIuZG5zY3J5cHQtY2VydC5vcGVuZG5zLmNvbQ",
        port: "443",
    },

    {
        name: "cleanbrowsing-security",
        sdns_stamp: "sdns://AQMAAAAAAAAAEjE4NS4yMjguMTY4Ljk6ODQ0MyC8rDL61UNpFx8IMtYHUCfDIIzu8Ojpn5QY3HdgZdSPKRFjbGVhbmJyb3dzaW5nLm9yZw",
        port: "8443",
    },

    {
        name: "dnscrypt.pl",
        sdns_stamp: "sdns://AQcAAAAAAAAAFDE3OC4yMTYuMjAxLjEyODoyMDUzIH9hfLgepVPSNMSbwnnHT3tUmAUNHb8RGv7mmWPGR6FpGzIuZG5zY3J5cHQtY2VydC5kbnNjcnlwdC5wbA",
        port: "2053",
    },

    {
        name: "dnsforfamily",
        sdns_stamp: "sdns://AQMAAAAAAAAADDc4LjQ3LjY0LjE2MSATJeLOABXNSYcSJIoqR5_iUYz87Y4OecMLB84aEAKPrRBkbnNmb3JmYW1pbHkuY29t",
        port: "443",
    },

    {
        name: "safesurfer",
        sdns_stamp: "sdns://AQIAAAAAAAAADzEwNC4xNTUuMjM3LjIyNSAnIH_VEgToNntINABd-f_R0wu-KpwzY55u2_iu2R1A2CAyLmRuc2NyeXB0LWNlcnQuc2FmZXN1cmZlci5jby5ueg",
        port: "443",
    },
];
const SUCCESS_THRESHOLD = 0.7;

export const useDNSCryptTest = (): Test => {
    const [state, setState] = useState<TestState>("not run");
    const [testHasRun, setTestHasRun] = useState<boolean>(false);

    console.log({ state, testHasRun });

    const runDNSCryptTest = async () => {
        setState("pending");
        setTestHasRun(true);
        const OStype = await getOS();
        if (OStype === OS.macOS) {
            // macOS
            return Promise.allSettled(
                DNS_SERVERS.map(async (server) => {
                    const cmd = `JSON=1 ./web/helpers/dnslookup "example.com" "${server.sdns_stamp}" | base64`;
                    console.log(cmd);
                    console.log(`Running DNSCrypt test using server '${server.name}'...`);
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
                            const jsonStr = Buffer.from(r.value.trim(), 'base64');
                            console.log(jsonStr);
                            const result = JSON.parse(jsonStr.toString()) as JSONMsg;
                            console.log(result);
                            if (!result.Response) {
                                console.error("Error: result is not a response");
                                // setState("failure");
                                // return;
                                continue;
                            }
                            if (result.Answer.length === 0) {
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
        testName: "DNSCrypt (ports 443, 5443, 8443, 2053)",
        state,
        testHasRun,
        runTest: runDNSCryptTest,
    };
};
