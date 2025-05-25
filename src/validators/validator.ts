export const isNumber = (val: unknown): val is number => {
    return typeof val === "number" && !isNaN(val);
};

export const isBoolean = (val: unknown): val is boolean => {
    return typeof val === "boolean";
};

export const isObject = (val: unknown): val is Record<string, unknown> =>
    typeof val === "object" && val !== null;


export default {
    isNumber,
    isBoolean,
    isObject
};
