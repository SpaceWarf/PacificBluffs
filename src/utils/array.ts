export const getAlphabeticallyOrdered = (array: any[], orderKey: string) => {
  const ordered = [...array];
  return ordered.sort((a, b) => a[orderKey].localeCompare(b[orderKey]));
}