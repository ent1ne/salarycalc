import { render, screen, fireEvent } from '@testing-library/react';

import { InputForm } from './InputForm';
import { Currency, Period, SalaryType } from '../utils/salary';
import '@testing-library/jest-dom';

describe('InputForm', () => {
    const defaultValues = {
        amount: 50000,
        currency: Currency.EUR,
        period: Period.Year,
        type: SalaryType.Gross,
        taxRate: 30,
    };

    it('renders correctly', () => {
        render(<InputForm values={defaultValues} onChange={() => { }} />);
        expect(screen.getByText('Currency')).toBeInTheDocument();
        expect(screen.getByText('Period')).toBeInTheDocument();
        expect(screen.getByText('Salary Type')).toBeInTheDocument();
        expect(screen.getByText('Amount')).toBeInTheDocument();
    });

    it('calls onChange when salary type is changed', () => {
        const handleChange = vi.fn();
        render(<InputForm values={defaultValues} onChange={handleChange} />);

        // Find the Net option and click it
        const netOption = screen.getByText(SalaryType.Net);
        fireEvent.click(netOption);

        expect(handleChange).toHaveBeenCalledWith({
            ...defaultValues,
            type: SalaryType.Net,
        });
    });

    it('calls onChange when period is changed via slider', () => {
        const handleChange = vi.fn();
        render(<InputForm values={defaultValues} onChange={handleChange} />);

        // Find the slider (range input)
        const slider = screen.getByLabelText('Period');

        // Change value to 1 (Day)
        fireEvent.change(slider, { target: { value: '1' } });

        expect(handleChange).toHaveBeenCalledWith({
            ...defaultValues,
            period: Period.Day,
        });
    });

    it('calls onChange when currency is changed via custom selector', () => {
        const handleChange = vi.fn();
        render(<InputForm values={defaultValues} onChange={handleChange} />);

        // Find the trigger and click it to open dropdown
        // The trigger displays the current currency value
        const trigger = screen.getByText(Currency.EUR);
        fireEvent.click(trigger);

        // Find the USD option in the dropdown and click it
        // Note: There might be multiple 'USD' texts (one in trigger if selected, one in option)
        // But since we start with EUR, USD should only be in the dropdown list
        const usdOption = screen.getByText(Currency.USD);
        fireEvent.click(usdOption);

        expect(handleChange).toHaveBeenCalledWith({
            ...defaultValues,
            currency: Currency.USD,
        });
    });
});
