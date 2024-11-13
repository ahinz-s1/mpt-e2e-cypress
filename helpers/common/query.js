import { ACCOUNTS } from '/config';


/**
 * A number, or a string containing a number.
 * @typedef Options
 * @type {object}
 * @prop {string} [rql] - 'javascript-rql' compatible RQL object
 * @prop {object} [query] - query object that will be merged with rql params if provided
 * @prop {'Client'|'Vendor'|'Operations'} [role] - a role as defined in fixtures. Allows making request on behalf other roles without switching
 * @prop {(v: T, res: Response<T>) => T} [onSuccess] - a callback that gets data along with original response and allows output transformation
 * @prop {object} [headers] - an object that will be assigned on default headers
 * @prop {object} [body] - an object that will be assigned on default headers
 */
/**
 * @param {'GET'|'POST'|'PUT'|'PATCH'|'DELETE'} method - http method
 * @param {string} url - /v1/public/ will be added fully or partially
 * @param {Options} options - various supported options
 */

export function query(method, url, options = {}) {
  const {
    rql: _rql,
    query: _query,
    role: _role,
    onSuccess: _onSuccess = (v, res) => v,
    headers: _headers = {},
    body: _body,
  } = options;

  const __query = typeof _query === 'string' ? _query : typeof _query === 'object' ? Object.keys(_query).map((k) => `${k}=${_query[k]}`).join('&') : '';

  const qs = `${__query}${__query ? '&' : ''}${_rql ? [_rql] : ''}`;

  return cy.get('@current').then(({ token } = {}) => {
    return cy.request({
      method,
      url: `/public/v1/${url.replace(/^\/?(public)?\/?(v1)?/g, '')}${qs ? `?${qs}` : ''}`,
      headers: {
        'Authorization': `Bearer ${token ?? ACCOUNTS[(_role ?? 'Client').toUpperCase()].token}`,
        ..._headers,
      },
      ...(_body ? { body: _body } : {}),
    }).then((res) => {
      const data = res?.body?.$meta && res?.body?.data ? res.body.data : res.body;

      return _onSuccess(data, res);
    });
  });
}