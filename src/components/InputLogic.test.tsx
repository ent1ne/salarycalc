import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SalaryCalculator } from './SalaryCalculator';
import '@testing-library/jest-dom';

describe('SalaryCalculator Input Logic', () => {
    it('allows clearing the amount input completely', () => {
        render(<SalaryCalculator />);

        // Select by initial value since label association is missing
        const amountInput = screen.getByDisplayValue('5000') as HTMLInputElement;

        // Validating we got the right input
        expect(amountInput.type).toBe('text');

        // Clear the input
        fireEvent.change(amountInput, { target: { value: '' } });

        // CURRENT BUG: This expectation will fail because it turns into '0'
        expect(amountInput.value).toBe('');

        // Type '1'
        fireEvent.change(amountInput, { target: { value: '1' } });

        // Should be '1', not '01'
        expect(amountInput.value).toBe('1');
    });
});
