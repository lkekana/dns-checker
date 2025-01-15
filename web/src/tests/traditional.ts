import { getOS, OS } from "../environment";
import { runCommand } from "../cmd";
import type { Test, TestState } from "../teststates";
import { useState } from "react";

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
	const [state, setState] = useState<TestState>("not run");
	const [testHasRun, setTestHasRun] = useState<boolean>(false);

	console.log({ state, testHasRun });

	const runTraditionalDNSTest = async () => {
		setState("pending");
		setTestHasRun(true);
		const OStype = await getOS();
		if (OStype === OS.macOS) {
			// macOS
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
		}

		if (OStype === OS.Windows) {
			// Windows
		}

		if (OStype === OS.Linux) {
			// Linux
		}
	};

	console.log({
		testName: "Traditional DNS",
		state,
		testHasRun,
		runTest: runTraditionalDNSTest,
	});
	return {
		testName: "Traditional DNS",
		state,
		testHasRun,
		runTest: runTraditionalDNSTest,
	};
};
