import React from 'react';
import { Period, type CurrencyRates } from '../utils/salary';

interface ResultsTableProps {
    title: string;
    rates: CurrencyRates;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ title, rates }) => {
    const periods = Object.values(Period);

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="glass-card" style={{ marginTop: '2rem' }}>
            <h2 style={{ marginBottom: '1rem', color: 'var(--accent-secondary)' }}>{title}</h2>
            <div style={{ display: 'grid', width: '100%', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                            <th style={{ padding: '1rem' }}>Period</th>
                            <th style={{ padding: '1rem', color: 'var(--accent-primary)' }}>EUR Net</th>
                            <th style={{ padding: '1rem', color: 'var(--accent-primary)' }}>EUR Gross</th>
                            <th style={{ padding: '1rem', color: 'var(--accent-secondary)' }}>USD Net</th>
                            <th style={{ padding: '1rem', color: 'var(--accent-secondary)' }}>USD Gross</th>
                        </tr>
                    </thead>
                    <tbody>
                        {periods.map(period => (
                            <tr key={period} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '1rem', fontWeight: 500 }}>{period}</td>
                                <td style={{ padding: '1rem' }}>{formatCurrency(rates.EUR.net[period], 'EUR')}</td>
                                <td style={{ padding: '1rem', opacity: 0.7 }}>{formatCurrency(rates.EUR.gross[period], 'EUR')}</td>
                                <td style={{ padding: '1rem' }}>{formatCurrency(rates.USD.net[period], 'USD')}</td>
                                <td style={{ padding: '1rem', opacity: 0.7 }}>{formatCurrency(rates.USD.gross[period], 'USD')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
