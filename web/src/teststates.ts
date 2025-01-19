import { useEffect, useState } from "react";
import { useTraditionalTest } from "./tests/traditional";
import { useHttpsTest } from "./tests/https";
import { useTLSTest } from "./tests/tls";
import { useDNSCryptTest } from "./tests/dnscrypt";
import { useObliviousTest } from "./tests/odoh";

export type TestState = "success" | "failure" | "pending" | "not run";

export interface Test {
	testName: string;
	state: TestState;
	testHasRun: boolean;
	runTest(): void | Promise<void>;
}

export const useTestStates = () => {
	const traditionalDNS = useTraditionalTest();
	const DoH = useHttpsTest();
	const DoT = useTLSTest();
	const DNSCrypt = useDNSCryptTest();
	const ODoH = useObliviousTest();
	const [tests, setTests] = useState<Test[]>(() => [
		traditionalDNS,
		DoH,
		DoT,
		DNSCrypt,
		ODoH,
	]);

	useEffect(() => {
		setTests([traditionalDNS, DoH, DoT, DNSCrypt, ODoH]);
	}, [traditionalDNS.state, traditionalDNS.testHasRun, DoH.state, DoH.testHasRun, DoT.state, DoT.testHasRun, DNSCrypt.state, DNSCrypt.testHasRun, ODoH.state, ODoH.testHasRun]);

	return { tests };
};
