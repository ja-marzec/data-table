import axios, { AxiosResponse } from "axios";
import {
  CompanyIncomeResponse,
  CompanyResponse,
  Company,
  IncomesResponse,
} from "../Model";

import moment, { Moment } from "moment";

export function getFromUrl<T>(url: string): Promise<T> {
  return axios.get<T>(url).then((response: AxiosResponse<T>) => {
    return response.data;
  });
}

export function fetchCompanies(): Promise<CompanyResponse[]> {
  return getFromUrl("https://recruitment.hal.skygate.io/companies");
}

export function fetchIncomes(id: number): Promise<CompanyIncomeResponse> {
  return getFromUrl(`https://recruitment.hal.skygate.io/incomes/${id}`);
}

export async function fetchCompaniesAll(): Promise<Company[]> {
  let companies = await fetchCompanies();
  return await Promise.all(
    companies.map(async (company) => {
      let income: CompanyIncomeResponse = await fetchIncomes(company.id);
      let res = computeSums(income.incomes);
      return {
        id: company.id,
        name: company.name,
        city: company.city,
        totalIncome: Number(res.total.toFixed(2)),
        averageIncome: Number((res.total / income.incomes.length).toFixed(2)),
        lastMonthIncome: Number(res.lastMonth.toFixed(2)),
      };
    })
  );
}

let lastDate: (incomes: IncomesResponse[]) => string = (
  incomes: IncomesResponse[]
) => {
  // const maxDateIncome: IncomesResponse | null = get_max(incomes, (income) => income.date)
  return incomes.reduce((first: IncomesResponse, second: IncomesResponse) =>
    second.date > first.date ? second : first
  ).date;
};

// function get_max<T>(arr: T[], keyFunction: (elem: T)=> any): T | null {
//   if(arr.length == 0) {
//     return null;
//   }
//   return arr.reduce((one, two) => {
//       return keyFunction(one) > keyFunction(two) ? one : two;
//   })
// }

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
// async function getAllReadyCompanies(companiesUrl, incomeUrl) {
//   let companies = await fetchCompanies(companiesUrl);
//   companies = await Promise.all(
//     companies.map(anc (company) => {
//       let incomeOfCompany = await fetchIncomesById(company.id, incomeUrl);
//       let res = sumAndAvgIncome(incomeOfCompany.incomes);
//       company.sum = Number(res.sum.toFixed(2));
//       company.avg = Number(res.avg.toFixed(2));
//       company.lastMonthIncome = getLastMonthIncome(incomeOfCompany.incomes);
//       return company;
//     })
//   );
//   return companies;
// }
