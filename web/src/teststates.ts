import { useEffect, useState } from "react";
import { useTraditionalTest } from "./tests/traditional";
import { useHttpsTest } from "./tests/https";
import { useTLSTest } from "./tests/tls";
import { useDNSCryptTest } from "./tests/dnscrypt";

export type TestState = "success" | "failure" | "pending" | "not run";

export interface Test {
	testName: string;
	state: TestState;
	testHasRun: boolean;
	runTest(): void | Promise<void>;
}

const initialTests: Test[] = [
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
	const DNSCrypt = useDNSCryptTest();
	const [tests, setTests] = useState<Test[]>(() => [
		traditionalDNS,
		DoH,
		DoT,
		DNSCrypt,
		...initialTests,
	]);

	useEffect(() => {
		setTests([traditionalDNS, DoH, DoT, DNSCrypt, ...initialTests]);
	}, [traditionalDNS.state, traditionalDNS.testHasRun, DoH.state, DoH.testHasRun, DoT.state, DoT.testHasRun, DNSCrypt.state, DNSCrypt.testHasRun]);

	return { tests };
};
