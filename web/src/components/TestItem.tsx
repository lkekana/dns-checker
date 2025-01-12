import React from 'react';
import { Centered } from './Centered';

interface TestItemProps {
    state: 'success' | 'failure' | 'pending';
    testName: string;
    runTest(): boolean;
}

const TestItem: React.FC<TestItemProps> = ({ state, testName, runTest }) => {
    const getBadgeClass = () => {
        switch (state) {
            case 'success':
                return 'badge-success';
            case 'failure':
                return 'badge-error';
            case 'pending':
                return 'badge-warning';
            default:
                return '';
        }
    };

    const getButtonState = () => {
        switch (state) {
            case 'success':
                return 'Test';
            case 'failure':
                return 'Retry';
            case 'pending':
                return 'Cancel';
            default:
                return '';
        }
    };

    return (
        <Centered>
            <div className="w-full flex items-center justify-between px-4 py-2">
                {/* Label */}
                <span>{testName}</span>

                <div className="w-1/2 flex items-center gap-2 justify-between">
                    {/* Badge */}
                    <div className={`badge ${getBadgeClass()} w-20 text-center`}>
                        {state}
                    </div>

                    {/* Button */}
                    <button className={`btn btn-neutral w-1/6`} onClick={runTest}>
                        {getButtonState()}
                    </button>
                </div>
            </div>
        </Centered>
    );
};

export default TestItem;