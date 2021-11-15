export const format = (template: string, ...args: string[]): string => {
  return args.reduce((text: string, arg: string, index: number) => {
    const regex = new RegExp(`\\{${index}\\}`, 'g');
    return text.replace(regex, arg);
  }, template);
};
