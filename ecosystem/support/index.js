import {login} from '/helpers';
import orders from '/helpers/api/orders';

Cypress.on('uncaught:exception', () => false);

const shouldCleanup = process.env.cleanup ?? true;

beforeEach(() => {
  cy.wrap({}).as('current');
  cy.wrap([]).as('trails');

  login();
});

const cleanup = {
  order: orders.cleanup,
}

Cypress.Commands.add('trail', {
  prevSubject: true,
}, (value, type) => {
  cy.get('@trails').then((trails) => [...trails, [type, value]]).as('trails');
  return cy.wrap(value);
});

Cypress.Commands.add('cleanup', () => {
  return cy.get('@trails').then((trails) => {
    (trails ?? []).forEach(([type, value]) => {
      if (type in cleanup) cleanup[type](value);
    });
  });
});

afterEach(() => {
  if (shouldCleanup) cy.cleanup();
});

