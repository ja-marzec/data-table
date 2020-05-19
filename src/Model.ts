
export interface CompanyResponse {
  id: number;
  name: string;
  city: string;
}
export type IncomesResponse = {
  value: string;
  date: string;
};
export interface CompanyIncomeResponse {
  id: number;
  incomes: IncomesResponse[];
}
export interface Company {
  id: number;
  name: string;
  city: string;
  totalIncome: number;
  averageIncome: number;
  lastMonthIncome: number;
}

