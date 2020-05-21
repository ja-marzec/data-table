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
