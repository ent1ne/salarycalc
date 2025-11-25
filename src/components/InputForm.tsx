import React from 'react';
import { Currency, Period, SalaryType, type SalaryInput } from '../utils/salary';
import { Tooltip } from './Tooltip';

interface InputFormProps {
    values: SalaryInput;
    onChange: (values: SalaryInput) => void;
}

export const InputForm: React.FC<InputFormProps> = ({ values, onChange }) => {
    const [isCurrencyOpen, setIsCurrencyOpen] = React.useState(false);

    const handleChange = (field: keyof SalaryInput, value: any) => {
        onChange({ ...values, [field]: value });
    };

    return (
        <div className="glass-card">
            <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '1rem' }}>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                    <label>Amount</label>
                    <input
                        type="number"
                        value={values.amount}
                        onChange={(e) => handleChange('amount', Number(e.target.value))}
                        onWheel={(e) => e.currentTarget.blur()}
                        min="0"
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
