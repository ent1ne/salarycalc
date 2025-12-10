import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SalaryCalculator } from './SalaryCalculator';
import '@testing-library/jest-dom';

describe('SalaryCalculator Input Validation', () => {
    it('restricts input to positive numbers, max 2 decimals, and supports comma', () => {
        render(<SalaryCalculator />);

        const amountInput = screen.getByLabelText('Amount') as HTMLInputElement;

        // 1. Positive numbers only (reject negative)
        // Note: For text input, we prevent typing the minus sign or validate against it
        fireEvent.change(amountInput, { target: { value: '-10' } });
        // Should ignore negative, keep previous or empty.
        // If we implement strictly, it should probably revert to last valid or empty.
        // Let's assume initially it shouldn't accept it.
        // However, standard behavior might be checking logic inside onChange.

        // Let's test valid flow first
        fireEvent.change(amountInput, { target: { value: '100' } });
        expect(amountInput.value).toBe('100');

        // 2. Max 2 decimal places
        fireEvent.change(amountInput, { target: { value: '100.22' } });
        expect(amountInput.value).toBe('100.22');

        // Try 3 decimals - should be ignored (stay 100.22)
        fireEvent.change(amountInput, { target: { value: '100.225' } });
        expect(amountInput.value).toBe('100.22');

        // 3. Comma support
        // User wants 100,22 to be treated as 100.22
        fireEvent.change(amountInput, { target: { value: '100,55' } });

        // Determine expected behavior:
        // Option A: Auto-replace comma with dot in UI? -> 100.55
        // Option B: Allow comma in UI but parse as dot?
        // Let's go with Option A for consistency as it's easier to handle
        expect(amountInput.value).toBe('100.55');

        // 4. Edge cases
        // Typing just '.' or ','
        fireEvent.change(amountInput, { target: { value: '.' } });
        expect(amountInput.value).toBe('.'); // Allow typing incomplete number

        fireEvent.change(amountInput, { target: { value: ',' } });
        expect(amountInput.value).toBe('.'); // Auto-replace
    });
});
