import { orders } from '/helpers/api';
import { OrderDetails } from '/helpers/pages';


describe('Order of type: Purchase, status: Draft', () => {
  beforeEach(() => {
    orders.create({
      type: 'Purchase',
      status: 'Draft',
    }).as('order');
  });

  describe('browsed as Client', () => {
    it('should render Header correctly', () => {
      cy.get('@order').then(({id}) => {
        OrderDetails.open(id);

        OrderDetails.Header.Title('should', 'contain', id);
        OrderDetails.Header.Status('should', 'contain', 'Draft');
        OrderDetails.Header.Actions.Button('should', 'contain', 'Edit');
        OrderDetails.Header.Actions.Button('should', 'be.enabled');
        OrderDetails.Header.Actions.Button('click');
        OrderDetails.PurchaseWizard.Modal('should', 'be.visible');
        OrderDetails.PurchaseWizard.CloseButton('click');
        OrderDetails.Header.Actions.DropdownButton('click');
        OrderDetails.Header.Actions.Dropdown('x.to.have.items.count', 2);
        OrderDetails.Header.Actions.DeleteAction('x.be.enabled');
        OrderDetails.Header.Actions.ProcessAction('x.be.disabled');
      });
    });

    it('should render Highlights block correctly', () => {
      cy.get('@order').then(({id, agreement, vendor, product}) => {
        OrderDetails.open(id);

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
});
