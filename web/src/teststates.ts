import { useEffect, useState } from "react";
import { useTraditionalTest } from "./tests/traditional";
import { useHttpsTest } from "./tests/https";

export type TestState = "success" | "failure" | "pending" | "not run";

export interface Test {
	testName: string;
	state: TestState;
	testHasRun: boolean;
	runTest(): void | Promise<void>;
}

const initialTests: Test[] = [
	{
		testName: "DNS over TLS (DoT)",
		state: "pending",
		testHasRun: false,
		runTest: () => {},
	},
	{
		testName: "DNSCrypt (443)",
		state: "success",
		testHasRun: false,
		runTest: () => {},
	},
	{
		testName: "DNSCrypt (5353)",
		state: "failure",
		testHasRun: false,
		runTest: () => {},
	},
	{
		testName: "DNSCrypt (53)",
		state: "pending",
		testHasRun: false,
		runTest: () => {},
	},
	{
		testName: "ODoH (443)",
		state: "success",
		testHasRun: false,
		runTest: () => {},
	},
];

export const useTestStates = () => {
	const traditionalDNS = useTraditionalTest();
	const DoH = useHttpsTest();
	const [tests, setTests] = useState<Test[]>(() => [
		traditionalDNS,
		DoH,
		...initialTests,
	]);

	useEffect(() => {
		setTests([traditionalDNS, DoH, ...initialTests]);
	}, [traditionalDNS.state, traditionalDNS.testHasRun, DoH.state, DoH.testHasRun]);

	return { tests };
};
