export const $and = (...vals) => `and(${vals.join(',')})`;
export const $or = (...vals) => `or(${vals.join(',')})`;
export const $in = (key, ...vals) => `in(${key},(${vals.map(v => `"${v}"`).join(',')}))`;
export const $eq = (key, val) => `eq(${key},"${val}")`;
export const $select = (...vals) => `select=${vals.join(',')}`;
export const $filter = (...vals) => `filter(${vals.join(',')})`;
export const $o = (obj) => Object.keys(obj).map(k => `${k}=${(obj[k]).toString()}`).join('&');

export const rql = (...conds) => conds.map(i => typeof i === 'string' ? i : $o(i)).join('&');