import { ACCOUNTS, USER, LOGIN } from "/config";
import { $element } from './elements';

export const switchTo = (role = 'Client') => {
  if (!ACCOUNTS[role.toUpperCase()]) throw new Error(`Role "${role}" is invalid as it doesn't meet in config`);

  cy.get('swo-header', { timeout: 10000 }).shadow().find('[data-testid="user-menu-dropdown-btn"]').should('be.visible');
  cy.get('swo-header').shadow().find('[data-testid="user-menu-dropdown-btn"]').click();
  cy.get('swo-header').shadow().find('[data-testid="list-row"]').contains(ACCOUNTS[role.toUpperCase()].id).click();
  cy.get('swo-header', { timeout: 10000 }).shadow().find('[data-testid="user-menu-dropdown-btn"]').should('contain', role);

  cy.wrap({
    ...ACCOUNTS[role.toUpperCase()],
  }).as('current');
};

export const login = () => {
  const args = { user: USER, account: ACCOUNTS.CLIENT };

  cy.session('current', () => {
    cy.visit('');

    cy.origin(LOGIN, { args }, (args) => {
      Cypress.on('uncaught:exception', () => false);

      cy.get('#username').type(args.user.login);
      cy.get('button:visible').contains('Continue').click();
      cy.get('#password:visible').type(args.user.password);
      cy.get('button:visible').contains('Continue').click();
    });

    cy.get('swo-header', { timeout: 10000 }).shadow().find('[data-testid="user-menu-dropdown-btn"]').should('be.visible');
    cy.get('swo-header').shadow().find('[data-testid="user-menu-dropdown-btn"]').click();
    cy.get('swo-header').shadow().find('[data-testid="list-row"]').contains(args.account.id).click();
    cy.get('swo-header', { timeout: 10000 }).shadow().find('[data-testid="user-menu-dropdown-btn"]').should('contain', 'Client');

    cy.wrap({
      ...args.account,
    }).as('current');
  });
};

export const $open = (url) => {
  cy.visit(url);
  $element('navigation')('should', 'be.visible');
}
