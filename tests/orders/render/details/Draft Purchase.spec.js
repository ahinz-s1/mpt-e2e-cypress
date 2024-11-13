import { orders } from '/helpers/api';
import { OrderDetails } from '/helpers/pages';


describe('Order Details page renders [Draft, Purchase]', () => {
  beforeEach(() => {
    orders.create().as('order');
  });

  it('Highlights block', () => {
    cy.get('@order').then(({id, agreement, vendor, product}) => {
      OrderDetails.open(id);

      OrderDetails.Header.Title('should', 'contain', id);
      OrderDetails.Header.Status('should', 'contain', 'Draft');

      OrderDetails.Highlights.Type('should', 'contain', 'Purchase');

      OrderDetails.Highlights.Agreement('should', 'contain', agreement.name);
      OrderDetails.Highlights.Agreement('should', 'contain', agreement.id);
      OrderDetails.Highlights.Agreement('should', 'contain', 'Draft');

      OrderDetails.Highlights.Vendor('should', 'contain', vendor.name);
      OrderDetails.Highlights.Vendor('should', 'contain', vendor.id);

      OrderDetails.Highlights.Product('should', 'contain', product.name);
      OrderDetails.Highlights.Product('should', 'contain', product.id);

      OrderDetails.Highlights.Currency('should','contain', 'USD');
      OrderDetails.Highlights.Assignee('should','contain', '—');
    });
  });
});
