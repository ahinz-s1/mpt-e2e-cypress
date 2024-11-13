import {$element, $open} from "../common";

export default {
  Header: {
    Title: $element('navigation__header-bar__title'),
    Status: $element('status-chip'),
  },

  Highlights: {
    Type: $element('type'),
    Agreement: $element('agreement'),
    Vendor: $element('vendor'),
    Product: $element('product'),
    Currency: $element('currency'),
    Assignee: $element('assignee'),
  },

  open(id) {
    $open(`/commerce/orders/${id}`);
  },
};