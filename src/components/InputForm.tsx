import React from 'react';
import { Currency, Period, SalaryType, type SalaryInput } from '../utils/salary';
import { Tooltip } from './Tooltip';

interface InputFormProps {
    values: SalaryInput;
    onChange: (values: SalaryInput) => void;
}

// Helper for amount validation
const isValidAmount = (value: string) => {
    if (value === '') return true;
    if (value.endsWith('.')) {
        const parts = value.split('.');
        return parts.length === 2 && /^\d*$/.test(parts[0]);
    }
    return /^\d+(\.\d{0,2})?$/.test(value);
};

export const InputForm: React.FC<InputFormProps> = ({ values, onChange }) => {
    const [isCurrencyOpen, setIsCurrencyOpen] = React.useState(false);
    // Local state for the amount input to handle string formatting (e.g., "12.")
    const [displayAmount, setDisplayAmount] = React.useState<string>(values.amount?.toString() ?? '');

    // Effect to sync local displayAmount with parent's values.amount
    React.useEffect(() => {
        // Only update if the parsed number from displayAmount is different from values.amount
        // This prevents overwriting "12." with "12" if values.amount is 12
        const currentParsedAmount = parseFloat(displayAmount);
        if (values.amount !== currentParsedAmount && !(isNaN(currentParsedAmount) && values.amount === undefined)) {
            setDisplayAmount(values.amount?.toString() ?? '');
        }
    }, [values.amount]); // Only re-run if values.amount changes

    const handleChange = (field: keyof SalaryInput, value: any) => {
        onChange({ ...values, [field]: value });
    };

    // Internal handler for Amount to manage text input behavior
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;

        // 1. Replace comma with dot for consistency
        val = val.replace(',', '.');

        // 2. Validate
        if (isValidAmount(val)) {
            setDisplayAmount(val); // Update local display state immediately

            // If the value is a complete number (not just "12."), update the parent state
            if (val === '') {
                handleChange('amount', undefined);
            } else if (/^\d+(\.\d{0,2})?$/.test(val)) { // Check if it's a fully formed number
                handleChange('amount', Number(val));
            }
            // If it's a "typing state" like "12.", we only update local state,
            // the parent's `amount` will retain its previous valid number or undefined.
        }
    };

    return (
        <div className="glass-card">
            <div className="form-group grid-sidebar">
                <div>
                    <label>Currency</label>
                    <div className="custom-select-container">
                        <div
                            className="custom-select-trigger"
                            onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                        >
                            <span>{values.currency}</span>
                            <span style={{ fontSize: '0.8em', opacity: 0.7 }}>▼</span>
                        </div>
                        {isCurrencyOpen && (
                            <div className="custom-select-dropdown">
                                {Object.values(Currency).map((currency) => (
                                    <div
                                        key={currency}
                                        className={`custom-select-option ${values.currency === currency ? 'selected' : ''}`}
                                        onClick={() => {
                                            handleChange('currency', currency);
                                            setIsCurrencyOpen(false);
                                        }}
                                    >
                                        {currency}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <label style={{ display: 'flex', alignItems: 'center' }}>
                        Salary Type
                        <Tooltip text="Your current salary: Gross means before taxes, Net — after taxes" />
                    </label>
                    <div className="segmented-control">
                        {Object.values(SalaryType).map((t) => (
                            <div
                                key={t}
                                className={`segmented-control-option ${values.type === t ? 'active' : ''}`}
                                onClick={() => handleChange('type', t)}
                            >
                                {t}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="period-slider">Period</label>
                <div className="slider-container">
                    <input
                        id="period-slider"
                        type="range"
                        min="0"
                        max="4"
                        step="1"
                        value={Object.values(Period).indexOf(values.period)}
                        onChange={(e) => {
                            const index = Number(e.target.value);
                            const period = Object.values(Period)[index];
                            handleChange('period', period);
                        }}
                        className="range-slider"
                    />
                    <div className="slider-label" data-testid="period-label">
                        {values.period}
                    </div>
                </div>
            </div>

            <div className="grid-2-cols">
                <div className="form-group">
                    <label htmlFor="amount">Amount</label>
                    <input
                        id="amount"
                        type="text"
                        inputMode="decimal"
                        value={displayAmount}
                        onChange={handleAmountChange}
                        onWheel={(e) => e.currentTarget.blur()}
                        autoComplete="off"
                    />
                </div>

                <div className="form-group">
                    <label style={{ display: 'flex', alignItems: 'center' }}>
                        Tax Rate %
                        <Tooltip text="Your current tax rate for Gross salary" />
                    </label>
                    <input
                        type="number"
                        value={values.taxRate}
                        onChange={(e) => handleChange('taxRate', Number(e.target.value))}
                        onWheel={(e) => e.currentTarget.blur()}
                        min="0"
                        max="100"
                    />
                </div>
            </div>

            <div className="grid-2-cols">
                <div className="form-group">
                    <label style={{ display: 'flex', alignItems: 'center' }}>
                        Min Desired Raise %
                        <Tooltip text="Your minimum acceptable raise percent to consider the offer" />
                    </label>
                    <input
                        type="number"
                        value={values.minRaise || ''}
                        onChange={(e) => handleChange('minRaise', e.target.value ? Number(e.target.value) : undefined)}
                        onWheel={(e) => e.currentTarget.blur()}
                        placeholder="Optional"
                    />
                </div>

                <div className="form-group">
                    <label style={{ display: 'flex', alignItems: 'center' }}>
                        Comfortable Raise %
                        <Tooltip text="Raise percent that will make the offer highly interesting" />
                    </label>
                    <input
                        type="number"
                        value={values.comfortableRaise || ''}
                        onChange={(e) => handleChange('comfortableRaise', e.target.value ? Number(e.target.value) : undefined)}
                        onWheel={(e) => e.currentTarget.blur()}
                        placeholder="Optional"
                    />
                </div>
            </div>
        </div>
    );
};
