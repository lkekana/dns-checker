import { getOS, OS } from "../environment";
import { runCommand } from "../cmd";
import type { Test, TestState } from "../teststates";
import { useState } from "react";
import { decodeB64Packet } from "./https";
import { DNSStamp } from "../lib/stamp";

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

/*
const initialTests: Test[] = [
    { testName: 'Traditional DNS', state: 'success', runTest: runDNSCryptTest443 },
    { testName: 'DNS over HTTPS (DoH)', state: 'failure', runTest: () => false },
    { testName: 'DNS over TLS (DoT)', state: 'pending', runTest: () => false },
    { testName: 'DNSCrypt (443)', state: 'success', runTest: () => true },
    { testName: 'DNSCrypt (5353)', state: 'failure', runTest: () => false },
    { testName: 'DNSCrypt (53)', state: 'pending', runTest: () => false },
    { testName: 'ODoH (443)', state: 'success', runTest: () => true },
];
*/

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
            return Promise.all(
                DNS_SERVERS.map(async (server) => {
                    const cmd = `./web/helpers/dist/dnscrypttt -d "example.com" -s ${server.sdns_stamp} -p ${server.port}`;
                    console.log(cmd);
                    const p = DNSStamp.parse(server.sdns_stamp) as DNSStamp.DNSCrypt;
                    console.log(`Running DoT test using server '${server.name}' (${p.providerName} ${p.addr})...`);
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
        testName: "DNSCrypt (ports 443, 5443, 8443, 2053)",
        state,
        testHasRun,
        runTest: runDNSCryptTest,
    };
};
