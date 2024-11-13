import { PRODUCT, ACCOUNTS } from '/config';
import { query, rql, $and, $in, $eq, $select, $filter } from '../common';


// HELPERS
const getCurrentListing = acc => query('GET', '/catalog/listings', {
  rql: rql({
    'product.id': acc.product.id,
  }),
}).then((listings) => ({
  ...acc,
  listing: listings[0],
  seller: { id: listings[0].seller.id },
}));

const getCurrentLicensees = acc => query('GET', '/accounts/licensees', {
  rql: rql(
    $select('seller'),
    $filter('group.buyers'),
    $and(
      $in('status', 'Active', 'Enabled'),
      $eq('account.id', acc.account.id),
      $eq('seller.id', acc.seller.id)
    ),
    { limit: 1000 },
  ),
}).then(licensees => ({...acc, licensees}));

const getCurrentItems = (acc) => query('GET', '/catalog/items', {
  rql: rql({
    'product.id': acc.product.id,
    limit: 1000,
  }),
}).then((items) => ({...acc, items}));

const getCurrentParameters = (acc) => query('GET', `catalog/products/${acc.product.id}/parameters`, {
  rql: rql({ limit: 1000 }),
}).then((parameters) => ({ ...acc, parameters }))

const getCurrentProduct = (acc) => query('GET', `/catalog/products/${acc.product.id}`)
  .then((product) => ({ ...acc, product }));


const preparePurchasePayload = ({ product, licensees, items }) => ({
  agreement: {
    product: { id: product.id },
    licensee: { id: licensees[0].id },
    name: `e2e ${product.name} - ${licensees[0].id}`,
  },
  lines: items.map(({ id }) => ({ item: { id }, quantity: 1 })),
  type: 'Purchase',
  status: 'Draft',
});

const prepareChangePayload = ({ agreement, items }) => ({
  agreement: {
    id: agreement.id,
  },
  lines: items.map(({ id }) => ({ item: { id }, quantity: 1 })),
  type: 'Change',
  status: 'Draft',
});


export const calls = {
  create: (body) => query('POST', '/commerce/orders', { body }),
  delete: (id) => query('DELETE', `commerce/orders/${id}`),
}

const create = (parameters = {}, transform = v => v) => {
  const {
    type: _type = 'Purchase',
    product: _product = { id: PRODUCT.id },
    agreement: _agreement = null,
    account: _account = { id: ACCOUNTS.CLIENT.id },
  } = parameters;

  if (_type === 'Change' && !_agreement) throw new Error('To create "Change" order you should provide an agreement id');

  return cy.wrap({
    type: _type,
    product: _product,
    agreement: _agreement,
    account: _account,
  })
    .then(getCurrentProduct)
    .then(getCurrentListing)
    .then(getCurrentLicensees)
    .then(getCurrentItems)
    .then(getCurrentParameters)
    .then((acc) => {

      const payload = acc.type === 'Purchase'
        ? preparePurchasePayload({ product: acc.product, licensees: acc.licensees, items: acc.items })
        : prepareChangePayload({ agreement: acc.agreement, items: acc.items });

      const { agreement = {}, lines, parameters, ...rest  } = transform(payload, acc);

      return {
        agreement: {
          ...payload.agreement,
          ...agreement,
        },

        lines: lines ?? payload.lines,

        parameters: parameters ?? {},

        ...rest,
      }
    })
    .then(calls.create)
    .trail('order');
};

export const cleanup = (order) => {
  return query('GET', `commerce/orders/${order.id}`)
    .then((order) => {
      if (order.status === 'Draft') calls.delete(order.id);
    });
};

export default {
  calls,
  create,
  cleanup,
};