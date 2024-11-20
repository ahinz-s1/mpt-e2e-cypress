import { orders } from '/helpers/api';
import { OrderDetails } from '/helpers/pages';
import { switchTo } from "/helpers";

const TERMS = {
  BILL: {
    '1m': 'Monthly billing',
    '1y': 'Yearly billing',
  },
  COMMIT: {
    '1m': '1 month commitment',
    '1y': '1 year commitment',
    '3y': '3 years commitment',
  },
};

const UNITS = {
  '1m': 'month',
  '1y': 'year',
};

describe('Order of type: Purchase, status: Draft', () => {
  beforeEach(() => {
    orders.create({
        type: 'Purchase',
        status: 'Draft',
      },
      (pl) => ({...pl, lines: [pl.lines[0]]}),
      (order, { items }) => ({
        ...order,
        lines: order.lines.map((line) => ({
          ...line,
          item: items.find(({id}) => id === line.item.id),
        })),
      })
    ).as('order');
  });

  describe('browsed as Client should render correctly when', () => {
    beforeEach(() => {
      cy.get('@order').then(({id, lines}) => {
        OrderDetails.open(id);
        switchTo('Operations');

        OrderDetails.Tabs.Items('click', { force: true });
        OrderDetails.Items.Grid('should', 'be.visible');
        OrderDetails.Items.LineEditButton(lines[0].item.id)('click');
        OrderDetails.Items.EditModal.Window('should', 'be.visible');

        OrderDetails.Items.EditModal.UnitPP.Input('should', 'have.value', '0');
        OrderDetails.Items.EditModal.Markup.Input('should', 'have.value', '0');
        OrderDetails.Items.EditModal.Margin.Input('should', 'have.value', '0');
        OrderDetails.Items.EditModal.UnitSP.Input('should', 'have.value', '0');
      });
    });

    it('all params but one are set to 0', () => {
      // Changing PP while 0's doesn't change anything else
      OrderDetails.Items.EditModal.spec({ UnitPP: '10' }, { UnitPP: '10', Markup: '0', Margin: '0', UnitSP: '10' });
      OrderDetails.Items.EditModal.reset();

      // Changing SP when others are 0 sets Markup to 0 and Margin to 100
      OrderDetails.Items.EditModal.spec({ UnitSP: 100 }, { UnitPP: '0', Markup: '0', Margin: '100', UnitSP: '100' });
      OrderDetails.Items.EditModal.reset();

      // Changing Markup when others are 0 affects Margin
      OrderDetails.Items.EditModal.spec({ Markup: '100' }, { UnitPP: '0', Markup: '100', Margin: '50', UnitSP: '0' });
      OrderDetails.Items.EditModal.reset();

      // Changing Margin when other are 0 affects Markup
      OrderDetails.Items.EditModal.spec({ Margin: '2.87' }, { UnitPP: '0', Markup: '2.95', Margin: '2.87', UnitSP: '0' });
    });

    it('Unit PP is first set', () => {
      // Changing Markup when PP is set affects Margin and SP
      OrderDetails.Items.EditModal.UnitPP.set(10);
      OrderDetails.Items.EditModal.spec({ Markup: '13.4' }, { UnitPP: '10', Markup: '13.4', Margin: '11.82', UnitSP: '11.34' });
      OrderDetails.Items.EditModal.reset();

      // Changing Margin when PP is set affects Markup and SP
      OrderDetails.Items.EditModal.UnitPP.set(10);
      OrderDetails.Items.EditModal.spec({ Margin: '11.2' }, { UnitPP: '10', Markup: '12.61', Margin: '11.2', UnitSP: '11.26' });
      OrderDetails.Items.EditModal.reset();

      // Changing SP when PP is set affects Markup and Margin
      OrderDetails.Items.EditModal.UnitPP.set(10);
      OrderDetails.Items.EditModal.spec({ UnitSP: '74.5' }, { UnitPP: '10', Markup: '645', Margin: '86.58', UnitSP: '74.5' });
    });

    it('Markup is first set', () => {
      // Changing PP when Markup is set affects SP
      OrderDetails.Items.EditModal.Markup.set(23);
      OrderDetails.Items.EditModal.spec({ UnitPP: '123' }, { UnitPP: '123', Markup: '23', Margin: '18.7', UnitSP: '151.29' });
      OrderDetails.Items.EditModal.reset();

      // Changing SP when Markup is set affects Markup and Margin
      OrderDetails.Items.EditModal.Markup.set(23);
      OrderDetails.Items.EditModal.spec({ UnitSP: '123' }, { UnitPP: '0', Markup: '0', Margin: '100', UnitSP: '123' });
    });

    it('UnitSP is first set', () => {
      // Changing PP when SP is set affects SP
      OrderDetails.Items.EditModal.UnitSP.set('263.21');
      OrderDetails.Items.EditModal.spec({ UnitPP: '123' }, { UnitPP: '123', Markup: '0', Margin: '100', UnitSP: '123' });
      OrderDetails.Items.EditModal.reset();

      // Changing Markup when SP is set affects SP and Margin
      OrderDetails.Items.EditModal.UnitSP.set('263.21');
      OrderDetails.Items.EditModal.spec({ Markup: '12' }, { UnitPP: '0', Markup: '12', Margin: '10.71', UnitSP: '0' });
      OrderDetails.Items.EditModal.reset();

      // Changing Margin when SP is set affects SP and Markup
      OrderDetails.Items.EditModal.UnitSP.set('263.21');
      OrderDetails.Items.EditModal.spec({ Margin: '12' }, { UnitPP: '0', Markup: '13.64', Margin: '12', UnitSP: '0' });
    });

    it('values are set back to 0', () => {
      // Changing Markup affects Margin, and SP
      OrderDetails.Items.EditModal.spec({ Markup: '12' }, { UnitPP: '0', Markup: '12', Margin: '10.71', UnitSP: '0' });
      OrderDetails.Items.EditModal.reset();

      // Changing Markup to 0 makes PP and SP equal
      OrderDetails.Items.EditModal.spec({ UnitPP: '123', Markup: '12' }, { UnitPP: '123', 'Markup': '12', Margin: '10.71', UnitSP: '137.76' });
      OrderDetails.Items.EditModal.spec({ Markup: '0' }, { UnitPP: '123', 'Markup': '0', Margin: '0', UnitSP: '123' });
      OrderDetails.Items.EditModal.reset();

      // Changing SP and PP to equal values sets Margin and Markup to 0
      OrderDetails.Items.EditModal.spec({ UnitPP: '123', Markup: '12' }, { UnitPP: '123', 'Markup': '12', Margin: '10.71', UnitSP: '137.76' });
      OrderDetails.Items.EditModal.spec({ UnitSP: '123' }, { UnitPP: '123', 'Markup': '0', Margin: '0', UnitSP: '123' });
      OrderDetails.Items.EditModal.reset();

      // Changing PP to 0 changes SP to 0 but does not affect Margin and Markup
      OrderDetails.Items.EditModal.spec({ UnitPP: '123', Markup: '12' }, { UnitPP: '123', 'Markup': '12', Margin: '10.71', UnitSP: '137.76' });
      OrderDetails.Items.EditModal.spec({ UnitPP: '0' }, { UnitPP: '0', 'Markup': '12', Margin: '10.71', UnitSP: '0' });
    });

    it('values are actually saved', () => {
      cy.get('@order').then(({id, lines}) => {
        const LINE = lines[0];
        const ITEM = LINE.item;
        const ID = ITEM.id;

        // Changing PP to be lower than SP results into negative markup and gives FE error
        OrderDetails.Items.EditModal.spec({ UnitPP: '123', Markup: '12' }, { UnitPP: '123', 'Markup': '12', Margin: '10.71', UnitSP: '137.76' });
        OrderDetails.Items.EditModal.spec({ UnitSP: '100' }, { UnitPP: '123', 'Markup': '-18.7', Margin: '-23', UnitSP: '100' });
        OrderDetails.Items.EditModal.Notification('should', 'contain.text','Negative markup is not allowed');
        OrderDetails.Items.EditModal.SaveButton('should', 'be.disabled');
        OrderDetails.Items.EditModal.reset();

        OrderDetails.Items.EditModal.spec({ UnitPP: '123', Markup: '12' }, { UnitPP: '123', 'Markup': '12', Margin: '10.71', UnitSP: '137.76' });
        OrderDetails.Items.EditModal.SaveButton('should', 'be.enabled');
        OrderDetails.Items.EditModal.SaveButton('click');

        OrderDetails.Items.Line(ID)('should', 'be.visible');

        // We need to wait for data to refresh
        cy.wait(1000);

        OrderDetails.Items.Line(ID)('x.verify.by.columns', {
          'Terms': [TERMS.BILL[ITEM.terms.period], TERMS.COMMIT[ITEM.terms.commitment]],
          'Qty': ['+1', '1'],
          'Unit PP': ['123.00', `license/${UNITS[ITEM.terms.period]}`],
          'PPxM': [`+${ITEM.terms.period === '1m' ? '123' : '10.25'}`],
          'PPxY': [`+${ITEM.terms.period === '1y' ? '123' : '1,476.00'}`],
          'PPx1': ['—'],
          'Yield': ['12.00% M↑', '10.71% M↓'],
          'Unit SP': ['137.76', `license/${UNITS[ITEM.terms.period]}`],
          'SPxM': [`+${ITEM.terms.period === '1m' ? '137.76' : '11.48'}`],
          'SPxY': [`+${ITEM.terms.period === '1y' ? '137.76' : '1,653.12'}`],
          'SPx1': ['—'],
        });
      });
    });
  });
});
