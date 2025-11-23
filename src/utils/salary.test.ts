import { describe, it, expect } from 'vitest';
import { calculateSalary, type SalaryInput, Period, Currency, SalaryType } from './salary';

describe('calculateSalary', () => {
    const baseInput: SalaryInput = {
        amount: 1000,
        currency: Currency.EUR,
        period: Period.Month,
        type: SalaryType.Net,
        taxRate: 0, // 0% tax for base tests
    };

    describe('Basic Conversions (No Tax)', () => {
        it('should convert Monthly to Yearly (x12)', () => {
            const result = calculateSalary({ ...baseInput, amount: 1000, period: Period.Month });
            expect(result.current.EUR.net.Year).toBeCloseTo(12000);
        });

        it('should convert Monthly to Hourly (Month=160h)', () => {
            const result = calculateSalary({ ...baseInput, amount: 1600, period: Period.Month });
            expect(result.current.EUR.net.Hour).toBeCloseTo(10);
        });

        it('should convert Yearly to Monthly (/12)', () => {
            const result = calculateSalary({ ...baseInput, amount: 12000, period: Period.Year });
            expect(result.current.EUR.net.Month).toBeCloseTo(1000);
        });

        it('should convert Weekly to Hourly (Week=40h)', () => {
            const result = calculateSalary({ ...baseInput, amount: 400, period: Period.Week });
            expect(result.current.EUR.net.Hour).toBeCloseTo(10);
        });
    });

    describe('Tax Logic', () => {
        // User Logic: Gross = Net / (1 - TaxRate)
        // User Logic: Net = Gross * (1 - TaxRate)

        it('should calculate Gross from Net correctly', () => {
            // Net = 1000, Tax = 20%. Gross = 1000 / (1 - 0.2) = 1250
            const result = calculateSalary({
                ...baseInput,
                amount: 1000,
                type: SalaryType.Net,
                taxRate: 20
            });
            expect(result.current.EUR.gross.Month).toBeCloseTo(1250);
            expect(result.current.EUR.net.Month).toBeCloseTo(1000);
        });

        it('should calculate Net from Gross correctly', () => {
            // Gross = 1250, Tax = 20%. Net = 1250 * (1 - 0.2) = 1000
            const result = calculateSalary({
                ...baseInput,
                amount: 1250,
                type: SalaryType.Gross,
                taxRate: 20
            });
            expect(result.current.EUR.net.Month).toBeCloseTo(1000);
            expect(result.current.EUR.gross.Month).toBeCloseTo(1250);
        });
    });

    describe('Currency Conversion', () => {
        // Fixed Rate: 1 EUR = 1.05 USD
        it('should convert EUR to USD', () => {
            const result = calculateSalary({ ...baseInput, amount: 100, currency: Currency.EUR });
            expect(result.current.USD.net.Month).toBeCloseTo(105);
        });

        it('should convert USD to EUR', () => {
            // 105 USD / 1.05 = 100 EUR
            const result = calculateSalary({ ...baseInput, amount: 105, currency: Currency.USD });
            expect(result.current.EUR.net.Month).toBeCloseTo(100);
        });
    });

    describe('Raise Logic', () => {
        it('should calculate minimum raise correctly', () => {
            // Base 1000, Min Raise 10% -> 1100
            const result = calculateSalary({
                ...baseInput,
                amount: 1000,
                minRaise: 10
            });
            expect(result.minRaise).toBeDefined();
            expect(result.minRaise?.EUR.net.Month).toBeCloseTo(1100);
        });

        it('should calculate comfortable raise correctly', () => {
            // Base 1000, Comf Raise 20% -> 1200
            const result = calculateSalary({
                ...baseInput,
                amount: 1000,
                comfortableRaise: 20
            });
            expect(result.comfortableRaise).toBeDefined();
            expect(result.comfortableRaise?.EUR.net.Month).toBeCloseTo(1200);
        });
    });
});
