import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SalaryCalculator } from './SalaryCalculator';
import { Period } from '../utils/salary';
import '@testing-library/jest-dom';

describe('SalaryCalculator', () => {
    it('initializes with Month as the default period', () => {
        render(<SalaryCalculator />);

        // Find the slider label which displays the current period
        // Based on our implementation, the label text is the period value
        const periodLabel = screen.getByTestId('period-label');
        expect(periodLabel).toHaveTextContent(Period.Month);

        // Optionally check the slider value
        const slider = screen.getByLabelText('Period') as HTMLInputElement;
        // Month is index 3 in the enum values array [Hour, Day, Week, Month, Year]
        // 0=Hour, 1=Day, 2=Week, 3=Month, 4=Year
        expect(slider.value).toBe('3');
    });
});
