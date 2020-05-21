import { Company, SortDirection } from "./Model";

export function mergeSort(
  visibleCompanies: Company[],
  comparator: (fist: Company, second: Company) => number
): Company[] {
  if (visibleCompanies.length <= 1) {
    return visibleCompanies;
  }
  const middle = Math.floor(visibleCompanies.length / 2);
  const left = visibleCompanies.slice(0, middle);
  const right = visibleCompanies.slice(middle);
  return merge(
    mergeSort(left, comparator),
    mergeSort(right, comparator),
    comparator
  );
}
function merge(
  left: Company[],
  right: Company[],
  comparator: (fist: Company, second: Company) => number
) {
  let resultArray = [],
    leftIndex = 0,
    rightIndex = 0;
  while (leftIndex < left.length && rightIndex < right.length) {
    if (comparator(left[leftIndex], right[rightIndex]) === -1) {
      resultArray.push(left[leftIndex]);
      leftIndex++;
    } else {
      resultArray.push(right[rightIndex]);
      rightIndex++;
    }
  }
  return resultArray
    .concat(left.slice(leftIndex))
    .concat(right.slice(rightIndex));
}
export function oppositeDirection(direction: SortDirection) {
  return direction === SortDirection.ASCENDING
    ? SortDirection.DESCENDING
    : SortDirection.ASCENDING;
}
export function filterValue(search: string) {
  return (company: Company) => {
    return (
      company.id.toString().indexOf(search) !== -1 ||
      company.name.toLowerCase().indexOf(search) !== -1 ||
      company.name.toUpperCase().indexOf(search) !== -1 ||
      company.name.indexOf(search) !== -1 ||
      company.city.toLowerCase().indexOf(search) !== -1 ||
      company.city.toUpperCase().indexOf(search) !== -1 ||
      company.city.indexOf(search) !== -1 ||
      company.totalIncome.toString().indexOf(search) !== -1 ||
      company.averageIncome.toString().indexOf(search) !== -1 ||
      company.lastMonthIncome.toString().indexOf(search) !== -1
    );
  };
}
export function sortByField(
  field: keyof Company,
  direction: SortDirection
): (fist: Company, second: Company) => number {
  const directionModifier = direction === SortDirection.ASCENDING ? 1 : -1;
  return (fist, second) => {
    if ((fist[field] as any) < (second[field] as any))
      return -1 * directionModifier;
    if ((fist[field] as any) > (second[field] as any))
      return 1 * directionModifier;
    return 0;
  };
}
