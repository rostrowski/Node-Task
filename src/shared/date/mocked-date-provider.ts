import { GetCurrentDate } from './date-provider.type';

type Test = (date: Date) => GetCurrentDate;
export const MockedDateProvider: Test = (date: Date) => () => date;