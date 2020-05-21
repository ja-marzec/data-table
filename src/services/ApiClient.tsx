import axios, { AxiosResponse } from "axios";
import {
  CompanyIncomeResponse,
  CompanyResponse,
  Company,
  IncomesResponse,
} from "../Model";

import moment, { Moment } from "moment";

const COMPANIES_URL: string = "https://recruitment.hal.skygate.io/companies";
const COMPANY_INCOMES_URL: string = "https://recruitment.hal.skygate.io/incomes/";

export function getFromUrl<T>(url: string): Promise<T> {
  return axios.get<T>(url).then((response: AxiosResponse<T>) => {
    return response.data;
  });
}

export function fetchCompanies(): Promise<CompanyResponse[]> {
  return getFromUrl(COMPANIES_URL);
}
export function fetchIncomes(id: number): Promise<CompanyIncomeResponse> {
  return getFromUrl(COMPANY_INCOMES_URL + id);
}
export async function fetchCompaniesAll(): Promise<Company[]> {
  let companies = await fetchCompanies();
  return Promise.all(
    companies.map(async (company) => {
      let income: CompanyIncomeResponse = await fetchIncomes(company.id);
      let result = computeSums(income.incomes);
      return {
        id: company.id,
        name: company.name,
        city: company.city,
        totalIncome: Number(result.total.toFixed(2)),
        averageIncome: Number(
          (result.total / income.incomes.length).toFixed(2)
        ),
        lastMonthIncome: Number(result.lastMonth.toFixed(2)),
      };
    })
  );
}

let lastDate: (incomes: IncomesResponse[]) => string = (
  incomes: IncomesResponse[]
) => {
  return incomes.reduce((first: IncomesResponse, second: IncomesResponse) =>
    second.date > first.date ? second : first
  ).date;
};

function computeSums(
  incomes: IncomesResponse[]
): { total: number; lastMonth: number } {
  let biggestDate = lastDate(incomes);
  let lastMonthDate = moment(biggestDate).subtract(1, "month");

  let sum = incomes.reduce(
    (sums, income) => ({
      total: sums.total + Number(income.value),
      lastMonth: sums.lastMonth + getValueAfterDate(income, lastMonthDate),
    }),
    { total: 0, lastMonth: 0 }
  );
  return sum;
}

function getValueAfterDate(income: IncomesResponse, date: Moment): number {
  if (moment(income.date).isAfter(date)) {
    return Number(income.value);
  }
  return 0;
}
