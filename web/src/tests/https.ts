import { getOS, OS } from "../environment";
import { runCommand } from "../cmd";
import type { Test, TestState } from "../teststates";
import { useState } from "react";
import { createQueryURL, decodeB64Packet } from "../lib/packet";

const DNS_SERVERS = [
    // Google Public DNS
    "https://dns.google/dns-query",

    // Cloudflare DNS
    "https://cloudflare-dns.com/dns-query",

    // Adguard DNS
    "https://dns.adguard.com/dns-query",

    // OpenDNS
    "https://doh.opendns.com/dns-query",
];
const SUCCESS_THRESHOLD = 0.7;

export const useHttpsTest = (): Test => {
    const [state, setState] = useState<TestState>("not run");
    const [testHasRun, setTestHasRun] = useState<boolean>(false);

    console.log({ state, testHasRun });

    const runHttpsDNSTest = async () => {
        setState("pending");
        setTestHasRun(true);
        const OStype = await getOS();
        if (OStype === OS.macOS) {
            // macOS
            return Promise.allSettled(
                DNS_SERVERS.map(async (server) => {
                    // const cmd = `dig @${server} example.com | jc --dig`;
                    // console.log(cmd);
                    // console.log(`Running traditional DNS test using server ${server}...`);
                    // return runCommand(cmd);
                    const url = createQueryURL(server, "example.com");
                    console.log(url);
                    console.log(`Running DoH test using server ${server}...`);
                    const cmd = `curl -s -X GET "${url}" | base64`;
                    return runCommand(cmd);
                }))
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
        testName: "DNS over HTTPS (DoH)",
        state,
        testHasRun,
        runTest: runHttpsDNSTest,
    };
};
