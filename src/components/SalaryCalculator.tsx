import React, { useState, useMemo } from 'react';
import { InputForm } from './InputForm';
import { ResultsTable } from './ResultsTable';
import { calculateSalary, Currency, Period, SalaryType, type SalaryInput } from '../utils/salary';

export const SalaryCalculator: React.FC = () => {
    const [input, setInput] = useState<SalaryInput>({
        amount: 5000,
        currency: Currency.EUR,
        period: Period.Month,
        type: SalaryType.Net,
        taxRate: 20,
        minRaise: undefined,
        comfortableRaise: undefined,
    });

    const results = useMemo(() => calculateSalary(input), [input]);

    return (
        <div className="calculator-container">
            <h1>Salary Calculator</h1>

            <InputForm values={input} onChange={setInput} />

            <ResultsTable title="Current Salary" rates={results.current} />

            {results.minRaise && (
                <ResultsTable title={`Minimum Raise (+${input.minRaise}%)`} rates={results.minRaise} />
            )}

            {results.comfortableRaise && (
                <ResultsTable title={`Comfortable Raise (+${input.comfortableRaise}%)`} rates={results.comfortableRaise} />
            )}
        </div>
    );
};
