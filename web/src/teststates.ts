import { useEffect, useState } from "react";
import { useTraditionalTest } from "./tests/traditional";
import { useHttpsTest } from "./tests/https";
import { useTLSTest } from "./tests/tls";

export type TestState = "success" | "failure" | "pending" | "not run";

export interface Test {
	testName: string;
	state: TestState;
	testHasRun: boolean;
	runTest(): void | Promise<void>;
}

const initialTests: Test[] = [
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
	const DoT = useTLSTest();
	const [tests, setTests] = useState<Test[]>(() => [
		traditionalDNS,
		DoH,
		DoT,
		...initialTests,
	]);

	useEffect(() => {
		setTests([traditionalDNS, DoH, DoT, ...initialTests]);
	}, [traditionalDNS.state, traditionalDNS.testHasRun, DoH.state, DoH.testHasRun, DoT.state, DoT.testHasRun]);

	return { tests };
};
