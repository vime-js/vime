export const dashToCamelCase = (str: string) =>
  str.replace(/-([a-z])/g, (_, up) => up.toUpperCase());

export const dashToPascalCase = (str: string) =>
  str
    .toLowerCase()
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('');
