export const $get = (testid, content) => {
  if (!content) return cy.get(`[data-testid="${testid}"]`);
  else return cy.get(`[data-testid="${testid}"]`).contains(content)
}

/**
 *
 * @param {string} testId
 * @param {string|function|null} [targeter]
 * @param {object} [extend]
 * @returns {(function(*, ...[*]): (*))|*}
 */
export const $element = (testId, targeter, extend = {}) => (action, ...values) => {
  let exec = v => v;

  if (action in extend) exec = el => extend[action](el, ...values);
  else if (action) exec = el => el[action]?.(...values)

  if (!targeter) return exec($get(testId));
  if (typeof targeter === 'string') return exec($get(testId, targeter));
  if (typeof targeter === 'function') return exec(targeter($get(testId)));

  throw new Error(`An element misconfiguration occurred for "${testId}"${typeof targeter === 'string' ? ` containing "${targeter}"`: ''}`);
}

// PREFIX ACTIONS with "x." as in "eXecute" or "eXpect" and use chai-like notation ("." separators)
export const IDropdown = {
  'x.to.have.items.count': (el, count = 0) => el
    .find('ul > li')
    .its('length')
    .should('eq', count)
}

export const IDropdownItem = {
  'x.to.be.disabled': el => el.should('have.class', /^_dropdown-list__item--disabled/),
  'x.to.be.enabled': el => el.should('not.have.class', /^_dropdown-list__item--disabled/),
}