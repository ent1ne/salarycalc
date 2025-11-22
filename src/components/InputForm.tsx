import React from 'react';
import { Currency, Period, SalaryType, type SalaryInput } from '../utils/salary';

interface InputFormProps {
    values: SalaryInput;
    onChange: (values: SalaryInput) => void;
}

export const InputForm: React.FC<InputFormProps> = ({ values, onChange }) => {
    const handleChange = (field: keyof SalaryInput, value: any) => {
        onChange({ ...values, [field]: value });
    };

    return (
        <div className="glass-card">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                    <label>Currency</label>
                    <select
                        value={values.currency}
                        onChange={(e) => handleChange('currency', e.target.value as Currency)}
                    >
                        {Object.values(Currency).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <div className="form-group">
                    <label>Period</label>
                    <select
                        value={values.period}
                        onChange={(e) => handleChange('period', e.target.value as Period)}
                    >
                        {Object.values(Period).map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>

                <div className="form-group">
                    <label>Type</label>
                    <select
                        value={values.type}
                        onChange={(e) => handleChange('type', e.target.value as SalaryType)}
                    >
                        {Object.values(SalaryType).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
            </div>

            <div className="form-group">
                <label>Amount</label>
                <input
                    type="number"
                    value={values.amount}
                    onChange={(e) => handleChange('amount', Number(e.target.value))}
                    min="0"
                />
            </div>

            <div className="form-group">
                <label>Tax Rate (%)</label>
                <input
                    type="number"
                    value={values.taxRate}
                    onChange={(e) => handleChange('taxRate', Number(e.target.value))}
                    min="0"
                    max="100"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                    <label>Min Desired Raise (%)</label>
                    <input
                        type="number"
                        value={values.minRaise || ''}
                        onChange={(e) => handleChange('minRaise', e.target.value ? Number(e.target.value) : undefined)}
                        placeholder="Optional"
                    />
                </div>

                <div className="form-group">
                    <label>Comfortable Raise (%)</label>
                    <input
                        type="number"
                        value={values.comfortableRaise || ''}
                        onChange={(e) => handleChange('comfortableRaise', e.target.value ? Number(e.target.value) : undefined)}
                        placeholder="Optional"
                    />
                </div>
            </div>
        </div>
    );
};
