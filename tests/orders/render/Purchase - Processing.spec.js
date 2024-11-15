import { orders } from '/helpers/api';
import { OrderDetails } from '/helpers/pages';


describe('Order of type: Purchase, status: Processing', () => {
  beforeEach(() => {
    orders.create({
      type: 'Purchase',
      status: 'Processing',
    }).as('order');
  });

  describe('browsed as Client', () => {
    it('should render Header correctly', () => {
      cy.get('@order').then(({id}) => {
        OrderDetails.open(id);

        OrderDetails.Header.Title('should', 'contain', id);
        OrderDetails.Header.Status('should', 'contain', 'Processing');
        OrderDetails.Header.Actions.Button('should', 'contain', 'Process').and('be.disabled');
        OrderDetails.Header.Actions.DropdownButton('click');
        OrderDetails.Header.Actions.Dropdown('x.to.have.items.count', 2);
        OrderDetails.Header.Actions.DeleteAction('x.be.disabled');
        OrderDetails.Header.Actions.EditAction('x.be.disabled');
      });
    });

    it('should render Highlights block correctly', () => {
      cy.get('@order').then(({id, agreement, vendor, product}) => {
        OrderDetails.open(id);

        OrderDetails.Notifications('should', 'contain', 'Your order is processing');
        OrderDetails.Highlights.Type('should', 'contain', 'Purchase');
        OrderDetails.Highlights.Agreement('should', 'contain', agreement.name);
        OrderDetails.Highlights.Agreement('should', 'contain', agreement.id);
        OrderDetails.Highlights.Agreement('should', 'contain', 'Provisioning');
        OrderDetails.Highlights.Vendor('should', 'contain', vendor.name);
        OrderDetails.Highlights.Vendor('should', 'contain', vendor.id);
        OrderDetails.Highlights.Product('should', 'contain', product.name);
        OrderDetails.Highlights.Product('should', 'contain', product.id);
        OrderDetails.Highlights.Currency('should','contain', 'USD');
        OrderDetails.Highlights.Assignee('should','contain', '—');
      });
    });
  });
});
