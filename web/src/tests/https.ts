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
            return Promise.all(
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
        testName: "DNS over HTTPS (DoH)",
        state,
        testHasRun,
        runTest: runHttpsDNSTest,
    };
};
