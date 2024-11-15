import {$element, IDropdownItem, IDropdown, $open} from "../common";

export default {
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

  PurchaseWizard: {
    Modal: $element('purchase-wizard__modal'),
    CloseButton: $element('button', 'Close'),
  },

  open(id) {
    $open(`/commerce/orders/${id}`);
  },
};