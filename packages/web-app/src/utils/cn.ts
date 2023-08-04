export const cn = (...classNames: (string | boolean | null)[]): string => {
    return classNames.filter(Boolean).join(" ");
};
