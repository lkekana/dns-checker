import { useEffect, useState } from "react";
import { useTraditionalTest } from "./tests/traditional";

export type TestState = "success" | "failure" | "pending" | "not run";

export interface Test {
	testName: string;
	state: TestState;
	testHasRun: boolean;
	runTest(): void | Promise<void>;
}

const initialTests: Test[] = [
	{
		testName: "DNS over HTTPS (DoH)",
		state: "failure",
		testHasRun: false,
		runTest: () => {},
	},
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
	const [tests, setTests] = useState<Test[]>(() => [
		traditionalDNS,
		...initialTests,
	]);

	useEffect(() => {
		setTests([traditionalDNS, ...initialTests]);
	}, [traditionalDNS.state, traditionalDNS.testHasRun]);

	return { tests };
};
