export const Period = {
    Hour: 'Hour',
    Day: 'Day',
    Week: 'Week',
    Month: 'Month',
    Year: 'Year',
} as const;
export type Period = typeof Period[keyof typeof Period];

export const Currency = {
    EUR: 'EUR',
    USD: 'USD',
} as const;
export type Currency = typeof Currency[keyof typeof Currency];

export const SalaryType = {
    Gross: 'Gross',
    Net: 'Net',
} as const;
export type SalaryType = typeof SalaryType[keyof typeof SalaryType];

export interface SalaryInput {
    amount: number | undefined;
    currency: Currency;
    period: Period;
    type: SalaryType;
    taxRate: number;
    minRaise?: number;
    comfortableRaise?: number;
}

export interface SalaryRates {
    gross: Record<Period, number>;
    net: Record<Period, number>;
}

export interface CurrencyRates {
    EUR: SalaryRates;
    USD: SalaryRates;
}

export interface SalaryResult {
    current: CurrencyRates;
    minRaise?: CurrencyRates;
    comfortableRaise?: CurrencyRates;
}

const HOURS_IN_YEAR = 1920;
const HOURS_IN_MONTH = 160;
const HOURS_IN_WEEK = 40;
const HOURS_IN_DAY = 8;
const EUR_TO_USD_RATE = 1.05;

const getHoursInPeriod = (period: Period): number => {
    switch (period) {
        case Period.Hour: return 1;
        case Period.Day: return HOURS_IN_DAY;
        case Period.Week: return HOURS_IN_WEEK;
        case Period.Month: return HOURS_IN_MONTH;
        case Period.Year: return HOURS_IN_YEAR;
    }
};

const convertToHourly = (amount: number, period: Period): number => {
    return amount / getHoursInPeriod(period);
};

const convertFromHourly = (hourlyAmount: number, period: Period): number => {
    return hourlyAmount * getHoursInPeriod(period);
};

const calculateTax = (amount: number, type: SalaryType, taxRate: number): { gross: number, net: number } => {
    const rate = taxRate / 100;
    if (type === SalaryType.Net) {
        const net = amount;
        const gross = net / (1 - rate);
        return { net, gross };
    } else {
        const gross = amount;
        const net = gross * (1 - rate);
        return { net, gross };
    }
};

const generateRates = (hourlyNet: number, hourlyGross: number): SalaryRates => {
    const periods = [Period.Hour, Period.Day, Period.Week, Period.Month, Period.Year];
    const net: any = {};
    const gross: any = {};

    periods.forEach(p => {
        net[p] = convertFromHourly(hourlyNet, p);
        gross[p] = convertFromHourly(hourlyGross, p);
    });

    return { net, gross };
};

const generateCurrencyRates = (hourlyNetEur: number, hourlyGrossEur: number): CurrencyRates => {
    // EUR Rates
    const eurRates = generateRates(hourlyNetEur, hourlyGrossEur);

    // USD Rates
    const hourlyNetUsd = hourlyNetEur * EUR_TO_USD_RATE;
    const hourlyGrossUsd = hourlyGrossEur * EUR_TO_USD_RATE;
    const usdRates = generateRates(hourlyNetUsd, hourlyGrossUsd);

    return {
        EUR: eurRates,
        USD: usdRates,
    };
};

export const calculateSalary = (input: SalaryInput): SalaryResult => {
    // 1. Normalize to EUR
    const safeAmount = input.amount || 0;

    let amountInEur = safeAmount;
    if (input.currency === Currency.USD) {
        amountInEur = safeAmount / EUR_TO_USD_RATE;
    }

    // 2. Convert to Hourly
    const hourlyAmount = convertToHourly(amountInEur, input.period);

    // 3. Calculate Net/Gross (Hourly)
    const { net: hourlyNetEur, gross: hourlyGrossEur } = calculateTax(hourlyAmount, input.type, input.taxRate);

    // 4. Generate Current Rates
    const current = generateCurrencyRates(hourlyNetEur, hourlyGrossEur);

    // 5. Handle Raises
    let minRaise: CurrencyRates | undefined;
    if (input.minRaise) {
        const raiseMultiplier = 1 + input.minRaise / 100;
        minRaise = generateCurrencyRates(hourlyNetEur * raiseMultiplier, hourlyGrossEur * raiseMultiplier);
    }

    let comfortableRaise: CurrencyRates | undefined;
    if (input.comfortableRaise) {
        const raiseMultiplier = 1 + input.comfortableRaise / 100;
        comfortableRaise = generateCurrencyRates(hourlyNetEur * raiseMultiplier, hourlyGrossEur * raiseMultiplier);
    }

    return {
        current,
        minRaise,
        comfortableRaise,
    };
};
