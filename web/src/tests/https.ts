import { getOS, OS } from "../environment";
import { runCommand } from "../cmd";
import type { Test, TestState } from "../teststates";
import { useState } from "react";
import * as dnsPacket from 'dns-packet';
// import { Buffer } from 'node:buffer';

// const DNS_SERVERS = [
//     // Google Public DNS
//     "https://dns.google/dns-query",

//     // Cloudflare DNS
//     "https://cloudflare-dns.com/dns-query",

//     // Adguard DNS
//     "https://dns.adguard.com/dns-query",

//     // OpenDNS
//     "https://doh.opendns.com/dns-query",

//     // Yandex DNS
//     "https://dns.yandex.com/dns-query",
// ];

const DNS_SERVERS = [
    // Google Public DNS
    "https://dns.google/dns-query",
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

// Function to encode a DNS query to Base64 URL-safe format
function createDnsBody(domain: string): string {
    // Create a DNS query for the given domain (A record)
    const query = dnsPacket.encode({
        type: 'query',
        id: Math.floor(Math.random() * 65535),  // Random ID
        questions: [{
            name: domain,
            type: 'A'
        }]
    } as dnsPacket.Packet);

    // Encode the binary query to Base64 (URL-safe)
    const base64Query = Buffer.from(query).toString('base64');
    
    // Make it URL-safe (replace + and / with URL-safe characters, remove padding)
    const urlSafeQuery = base64Query.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return urlSafeQuery;
}

function createQueryURL(server: string, domain: string): string {
    const encodedQuery = createDnsBody(domain);
    const url = `${server}?dns=${encodedQuery}`;
    return url;
}

function decodeB64Packet(encodedPacket: string): dnsPacket.Packet {
    // Decode the Base64-encoded packet
    const base64Packet = encodedPacket.replace(/-/g, '+').replace(/_/g, '/');
    const buffer = Buffer.from(base64Packet, 'base64');
    const packet = dnsPacket.decode(buffer);
    return packet;
}

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
            const url = createQueryURL("https://dns.google/dns-query", "example.com");
            console.log(url);
            console.log(`Running DoH test using server ${"https://dns.google/dns-query"}...`);
            const cmd = `curl -s -X GET "${url}" | base64`;
            const response = await runCommand(cmd);
            console.log(response);
            const decodedPacket = decodeB64Packet(response);
            console.log(decodedPacket);
            // console.log(await runCommand(`curl "${url}"`));

            /*
            return Promise.all(
                DNS_SERVERS.map(async (server) => {
                    const cmd = `dig @${server} example.com | jc --dig`;
                    console.log(cmd);
                    console.log(`Running traditional DNS test using server ${server}...`);
                    return runCommand(cmd);
                }),
            )
                .then((results) => {
                    console.log(`Results: ${results}`);
                    for (const result of results) {
                        const resultsObjArray = JSON.parse(result);
                        if (!Array.isArray(resultsObjArray)) {
                            console.error("Error: resultsObjArray is not an array");
                            setState("failure");
                            return;
                        }
                        if (resultsObjArray.length === 0) {
                            console.error("Error: resultsObjArray is empty");
                            setState("failure");
                            return;
                        }
                        if (!resultsObjArray[0].status || resultsObjArray[0].status !== "NOERROR") {
                            console.error("Error: status is not NOERROR");
                            setState("failure");
                        }
                    }
                    setState("success");
                })
                .catch((error) => {
                    console.error(`Error: ${error}`);
                    setState("failure");
                });
            */
            // return await Promise.all(
            //     DNS_SERVERS.map(async (server) => {
            //         // const cmd = `dig @${server} example.com | jc --dig`;
            //         // console.log(cmd);
            //         // console.log(`Running traditional DNS test using server ${server}...`);
            //         // return runCommand(cmd);
            //         const url = createQueryURL(server, "example.com");
            //         console.log(url);
            //         console.log(`Running DoH test using server ${server}...`);
            //         console.log(await runCommand(`curl -s -X GET ${url}`));
            //     }))
            //     .then(() => {
            //         // console.log(`Results: ${results}`);
            //         // for (const result of results) {
            //         //     const resultsObjArray = JSON.parse(result);
            //         //     if (!Array.isArray(resultsObjArray)) {
            //         //         console.error("Error: resultsObjArray is not an array");
            //         //         setState("failure");
            //         //         return;
            //         //     }
            //         //     if (resultsObjArray.length === 0) {
            //         //         console.error("Error: resultsObjArray is empty");
            //         //         setState("failure");
            //         //         return;
            //         //     }
            //         //     if (!resultsObjArray[0].status || resultsObjArray[0].status !== "NOERROR") {
            //         //         console.error("Error: status is not NOERROR");
            //         //         setState("failure");
            //         //     }
            //         // }
            //         setState("success");
            //     });
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
