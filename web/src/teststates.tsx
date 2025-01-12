import { useState } from 'react';

type TestState = 'success' | 'failure' | 'pending';

interface Test {
    testName: string;
    state: TestState;
    runTest(): boolean;
}

const initialTests: Test[] = [
    { testName: 'Traditional DNS', state: 'success', runTest: () => true },
    { testName: 'DNS over HTTPS (DoH)', state: 'failure', runTest: () => false },
    { testName: 'DNS over TLS (DoT)', state: 'pending', runTest: () => false },
    { testName: 'DNSCrypt (443)', state: 'success', runTest: () => true },
    { testName: 'DNSCrypt (5353)', state: 'failure', runTest: () => false },
    { testName: 'DNSCrypt (53)', state: 'pending', runTest: () => false },
    { testName: 'ODoH (443)', state: 'success', runTest: () => true },
];

export const useTestStates = () => {
    const [tests, setTests] = useState<Test[]>(initialTests);

    const updateTestState = (testName: string, newState: TestState) => {
        setTests(prevTests =>
            prevTests.map(test =>
                test.testName === testName ? { ...test, state: newState } : test
            )
        );
    };

    return { tests, updateTestState };
};