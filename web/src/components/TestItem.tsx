import React from 'react';
import { Centered } from './Centered';
import type { Test } from '../teststates';

const TestItem: React.FC<Test> = ({ state, testName, testHasRun, runTest }) => {
    console.log('Render TestItem');
    const getBadgeClass = () => {
        if (!testHasRun) {
            return 'badge-warning';
        }
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
        if (!testHasRun) {
            return 'Run';
        }
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

    console.log({ testName, state, testHasRun, getButtonState: getButtonState() });

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
                    <button type='button'  className={'btn btn-neutral w-1/6'} onClick={runTest}>
                        {getButtonState()}
                    </button>
                </div>
            </div>
        </Centered>
    );
};

export default TestItem;