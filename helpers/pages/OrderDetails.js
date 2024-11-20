import {$open, $element, $hasClass, $id, IDropdownItem, IDropdown} from "../common";


export const getEditModalFieldInterface = (label) => ({
  Radio: $element(
    'item-edit-modal',
    el => el
      .find($hasClass('item-edit__entity'))
      .filter(`:contains(${label})`)
      .find($id('radio-button-label')),
  ),

  Input: $element(
    'item-edit-modal',
    el => el
      .find($hasClass('item-edit__entity'))
      .filter(`:contains(${label})`)
      .find($id('input__input-text'))
  ),

  set(value) {
    getEditModalFieldInterface(label).Radio('click');
    getEditModalFieldInterface(label).Input('clear').type(value);
  },

  expect(value) {
    getEditModalFieldInterface(label).Input('should', 'have.value', value);
  }
});


export const OrderDetails = {
  Header: {
    Title: $element('navigation__header-bar__title'),
    Status: $element('status-chip'),
    Actions: {
      Button: $element('action-button'),
      DropdownButton: $element('dropdown-action-button'),
      Dropdown: $element('dropdown', null, IDropdown),

      DeleteAction: $element(
        'dropdown',
        el => el.find('li').contains('Delete'),
        IDropdownItem,
      ),

      EditAction: $element(
        'dropdown',
        el => el.find('li').contains('Edit'),
        IDropdownItem,
      ),

      ProcessAction: $element(
        'dropdown',
        el => el.find('li').contains('Process'),
        IDropdownItem
      ),
    },
  },

  Notifications: $element('status-notification'),

  Highlights: {
    Type: $element('type'),
    Agreement: $element('agreement'),
    Vendor: $element('vendor'),
    Product: $element('product'),
    Currency: $element('currency'),
    Assignee: $element('assignee'),
  },

  Tabs: {
    Items: $element('tab-items'),
  },

  Items: {
    Grid: $element('items-table'),
    Line: (locator = '') => $element(
      'items-table',
      el => el.find(`tr${$hasClass('items__table__row')}:contains(${locator})`),
      {
        'x.verify.by.columns': (el, spec) => cy.get(`${$id('items-table')} thead th`)
          .then(cols => {
            let keys = [];
            cols.contents().each((i, { textContent }) => keys.push(textContent));

            el.find('td').then((cells) => {
              let values = [];
              cells.each((i, {textContent}) => values.push(textContent));

              const ref = keys.reduce((acc, key, index) => ({ ...acc, [key]: values[index] }), {});

              Object.keys(spec).forEach(title => {
                spec[title].forEach((expectation) => {
                  expect(ref[title]).includes(expectation);
                });
              });
            });
          }),
      },
    ),

    LineEditButton: (locator = '') => $element(
      'items-table',
      el => el.find(`tr${$hasClass('items__table__row')}:contains(${locator})`).find($id('button-action')),
    ),

    EditModal: {
      Window: $element('item-edit-modal'),
      Notification: $element('inline-notification-content'),
      SaveButton: $element('save-button'),

      UnitPP: getEditModalFieldInterface('Unit PP'),
      Markup: getEditModalFieldInterface('Markup'),
      Margin: getEditModalFieldInterface('Margin'),
      UnitSP: getEditModalFieldInterface('Unit SP'),

      set: spec => Object.keys(spec).forEach((key) => OrderDetails.Items.EditModal[key].set(spec[key])),
      reset: () => ['UnitPP', 'Markup', 'Margin', 'UnitSP'].forEach((key) => OrderDetails.Items.EditModal[key].set('0')),
      expect: spec => Object.keys(spec).forEach((key) => OrderDetails.Items.EditModal[key].expect(spec[key])),

      spec: (input, result) => {
        OrderDetails.Items.EditModal.set(input);
        OrderDetails.Items.EditModal.expect(result);
      },
    },
  },

  PurchaseWizard: {
    Modal: $element('purchase-wizard__modal'),
    CloseButton: $element('button', 'Close'),
  },

  open(id) {
    $open(`/commerce/orders/${id}`);
  },
};

export default OrderDetails;