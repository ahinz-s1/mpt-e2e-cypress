export const $get = (testid, content) => {
  if (!content) return cy.get(`[data-testid="${testid}"]`);
  else return cy.get(`[data-testid="${testid}"]`).contains(content)
}

export const $element = (testId, content) => (action, ...values) => {
  if (action) return $get(testId, content)[action](...values);
  else return $get(testId, content);
}