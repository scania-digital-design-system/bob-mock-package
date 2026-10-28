import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  BodyCell,
  type BodyCellProps,
  HeaderCell,
  type HeaderCellProps,
  Table,
  TableBody,
  TableBodyInputWrapper,
  TableBodyRow,
  TableBodyRowExpandable,
  type TableBodyRowExpandableProps,
  type TableBodyRowProps,
  TableFooter,
  type TableFooterProps,
  TableHeader,
  TableHeaderInputWrapper,
  type TableHeaderProps,
  type TableProps,
  TableToolbar,
  type TableToolbarProps,
} from '../src';

// Expected behaviour is Tegel's table family at @scania/tegel@1.66.1
// (packages/core/src/components/table/). The cells render a native <table>. The children
// read the table's props through its modifier classes; the cells share state through the
// DOM: aria-sort, aria-expanded, checkbox state and data-text-align and data-hover on
// body cells.

function firstDetail(handler: ReturnType<typeof vi.fn>) {
  const event = handler.mock.calls[0]?.[0] as CustomEvent | undefined;
  return event?.detail;
}

type Parts = {
  table?: TableProps;
  header?: TableHeaderProps;
  name?: HeaderCellProps;
  row?: TableBodyRowProps;
  cell?: BodyCellProps;
  toolbar?: TableToolbarProps;
  footer?: TableFooterProps;
};

function renderTable({ table, header, name, row, cell, toolbar, footer }: Parts = {}) {
  const result = render(
    <Table tableId="vehicles" {...table}>
      {toolbar && <TableToolbar {...toolbar} />}
      <TableHeader {...header}>
        <HeaderCell cellKey="name" cellValue="Name" {...name} />
        <HeaderCell cellKey="count" cellValue="Count" sortable textAlign="right" />
      </TableHeader>
      <TableBody>
        <TableBodyRow {...row}>
          <BodyCell cellKey="name" cellValue="Truck" {...cell} />
          <BodyCell cellKey="count" cellValue="4" />
        </TableBodyRow>
        <TableBodyRow>
          <BodyCell cellKey="name" cellValue="Bus" />
          <BodyCell cellKey="count" cellValue="2" />
        </TableBodyRow>
      </TableBody>
      {footer && <TableFooter {...footer} />}
    </Table>,
  );
  return { ...result, root: result.container.querySelector('table') as HTMLTableElement };
}

const headerCell = (name: string) => screen.getByRole('columnheader', { name });
const bodyCell = (text: string) => screen.getByRole('cell', { name: text });

describe('Table matches tds-table', () => {
  it.each<[string, TableProps, string[]]>([
    [
      'plain by default',
      {},
      [
        'tl-table--compact-design-false',
        'tl-table--vertical-dividers-false',
        'tl-table--no-min-width-false',
        'tl-table--multiselect-false',
        'tl-table--expandable-rows-false',
        'tl-table--responsive-false',
        'tl-table--zebra-mode-none',
      ],
    ],
    [
      'compact, divided, responsive, zebra rows',
      { compactDesign: true, verticalDividers: true, responsive: true, zebraMode: 'rows-odd' },
      [
        'tl-table--compact-design-true',
        'tl-table--vertical-dividers-true',
        'tl-table--responsive-true',
        'tl-table--zebra-mode-rows-odd',
      ],
    ],
  ])('is %s', (_name, props, want) => {
    const { root } = renderTable({ table: props });
    expect(root).toHaveClass('tl-table', ...want);
    expect(root).toHaveAttribute('data-table-id', 'vehicles');
  });

  it('marks the column that sortColumnKey and sortDirection name', () => {
    renderTable({ table: { sortColumnKey: 'count', sortDirection: 'desc' } });
    expect(headerCell('Count')).toHaveAttribute('aria-sort', 'descending');
  });
});

describe('HeaderCell matches tds-header-cell', () => {
  it('renders text, or a sort button when sortable', () => {
    renderTable();
    expect(headerCell('Name').querySelector('p')).toHaveTextContent('Name');
    expect(screen.getByRole('button', { name: 'Count' })).toBeInTheDocument();
  });

  it('sorts ascending, then descending, and sends tdsSort', () => {
    const onTdsSort = vi.fn();
    renderTable({ name: { sortable: true, onTdsSort } });
    fireEvent.click(screen.getByRole('button', { name: 'Name' }));
    expect(headerCell('Name')).toHaveAttribute('aria-sort', 'ascending');
    expect(firstDetail(onTdsSort)).toEqual({
      tableId: 'vehicles',
      columnKey: 'name',
      sortingDirection: 'asc',
    });
    fireEvent.click(screen.getByRole('button', { name: 'Name' }));
    expect(headerCell('Name')).toHaveAttribute('aria-sort', 'descending');
    fireEvent.click(screen.getByRole('button', { name: 'Count' }));
    expect(headerCell('Name')).toHaveAttribute('aria-sort', 'none');
    expect(headerCell('Count')).toHaveAttribute('aria-sort', 'ascending');
  });

  it('gives body cells its alignment unless they set their own', () => {
    renderTable({ name: { textAlign: 'center' }, cell: { textAlign: 'end' } });
    expect(headerCell('Name')).toHaveClass('tl-header-cell--center');
    expect(bodyCell('Truck')).toHaveAttribute('data-text-align', 'end');
    expect(bodyCell('Bus')).toHaveAttribute('data-text-align', 'center');
    expect(bodyCell('4')).toHaveAttribute('data-text-align', 'right');
  });

  it('highlights the body cells of its column on hover', () => {
    renderTable();
    fireEvent.mouseOver(headerCell('Name'));
    expect(bodyCell('Truck')).toHaveAttribute('data-hover');
    expect(bodyCell('4')).not.toHaveAttribute('data-hover');
    fireEvent.mouseLeave(headerCell('Name'));
    expect(bodyCell('Truck')).not.toHaveAttribute('data-hover');
  });
});

describe('TableHeader and TableBodyRow match tds-table-header and tds-table-body-row', () => {
  it('sends tdsSelect with the selected rows when a row checkbox changes', () => {
    const onTdsSelect = vi.fn();
    const { root } = renderTable({ table: { multiselect: true }, row: { onTdsSelect } });
    const [, first] = root.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    fireEvent.click(first as HTMLInputElement);
    expect(firstDetail(onTdsSelect)).toEqual({
      tableId: 'vehicles',
      checked: true,
      selectedRows: [
        [
          { cellKey: 'name', cellValue: 'Truck' },
          { cellKey: 'count', cellValue: '4' },
        ],
      ],
    });
  });

  it('sends tdsSelectAll from the header checkbox', () => {
    const onTdsSelectAll = vi.fn();
    const { root } = renderTable({ row: { selected: true }, header: { onTdsSelectAll } });
    fireEvent.click(root.querySelector('thead input') as HTMLInputElement);
    expect(firstDetail(onTdsSelectAll)).toMatchObject({ checked: true, selectedRows: [[{}, {}]] });
  });

  it('sets the header checkbox from selected and indeterminate', () => {
    const { root } = renderTable({ header: { selected: true, indeterminate: true } });
    const all = root.querySelector('thead input') as HTMLInputElement;
    expect(all.checked).toBe(true);
    expect(all.indeterminate).toBe(true);
  });

  it('applies selected when it changes, not on every render', () => {
    const { root, rerender } = renderTable({ row: { selected: true } });
    const checkbox = root.querySelector('tbody input') as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
    fireEvent.click(checkbox);
    rerender(
      <Table>
        <TableBody>
          <TableBodyRow selected />
        </TableBody>
      </Table>,
    );
    expect(checkbox.checked).toBe(false);
    rerender(
      <Table>
        <TableBody>
          <TableBodyRow selected={false} />
        </TableBody>
      </Table>,
    );
    expect(checkbox.checked).toBe(false);
  });

  it('sends tdsClick with the row index from a clickable row, also on Enter', () => {
    const onTdsClick = vi.fn();
    const { root } = renderTable({ row: { clickable: true, onTdsClick } });
    const row = root.querySelector('tbody tr') as HTMLElement;
    expect(row).toHaveAttribute('tabindex', '0');
    fireEvent.click(row);
    expect(firstDetail(onTdsClick)).toMatchObject({ tableId: 'vehicles', rowIndex: 0 });
    fireEvent.keyDown(row, { key: 'Enter' });
    expect(onTdsClick).toHaveBeenCalledTimes(2);
  });
});

describe('BodyCell matches tds-body-cell', () => {
  it.each<[string, BodyCellProps, string[]]>([
    ['top and padded by default', {}, ['tl-body-cell--top', 'tl-body-cell--disable-padding-false']],
    [
      'middle without padding',
      { verticalAlign: 'middle', disablePadding: true },
      ['tl-body-cell--middle', 'tl-body-cell--disable-padding-true'],
    ],
  ])('is %s', (_name, props, want) => {
    renderTable({ cell: props });
    expect(bodyCell('Truck')).toHaveClass('tl-body-cell', ...want);
  });
});

describe('TableBodyRowExpandable matches tds-table-body-row-expandable', () => {
  function renderExpandable(first: TableBodyRowExpandableProps, multiselect = false) {
    const result = render(
      <Table tableId="vehicles" multiselect={multiselect} expandableRows>
        <TableHeader>
          <HeaderCell cellKey="name" cellValue="Name" />
          <HeaderCell cellKey="count" cellValue="Count" />
        </TableHeader>
        <TableBody>
          <TableBodyRowExpandable rowId="one" expandRow="More about trucks" {...first}>
            <BodyCell cellValue="Truck" />
          </TableBodyRowExpandable>
          <TableBodyRowExpandable rowId="two" autoCollapse expanded>
            <BodyCell cellValue="Bus" />
          </TableBodyRowExpandable>
        </TableBody>
      </Table>,
    );
    const buttons = result.container.querySelectorAll<HTMLButtonElement>(
      '.tl-table-body-row-expandable__control',
    );
    return {
      ...result,
      first: buttons[0] as HTMLButtonElement,
      second: buttons[1] as HTMLButtonElement,
    };
  }

  it('expands and collapses, and sends tdsChange', () => {
    const onTdsChange = vi.fn();
    const { first } = renderExpandable({ onTdsChange, tdsAriaLabelExpandButton: 'Expand' });
    expect(first).toHaveAttribute('aria-expanded', 'false');
    expect(first).toHaveAccessibleName('Expand');
    fireEvent.click(first);
    expect(first).toHaveAttribute('aria-expanded', 'true');
    expect(firstDetail(onTdsChange)).toEqual({
      rowId: 'one',
      isExpanded: true,
      tableId: 'vehicles',
    });
    fireEvent.click(first);
    expect(first).toHaveAttribute('aria-expanded', 'false');
  });

  it('collapses an expanded autoCollapse row when another row expands', () => {
    const { first, second } = renderExpandable({});
    expect(second).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(first);
    expect(second).toHaveAttribute('aria-expanded', 'false');
  });

  it.each<[string, TableBodyRowExpandableProps, boolean, number]>([
    ['the columns plus the expand column', {}, false, 3],
    ['one more with multiselect', {}, true, 4],
    ['colSpan when set', { colSpan: '7' }, false, 7],
  ])('spans the expanded row over %s', (_name, props, multiselect, want) => {
    const { getByText } = renderExpandable(props, multiselect);
    expect((getByText('More about trucks').closest('td') as HTMLTableCellElement).colSpan).toBe(
      want,
    );
  });
});

describe('Table input wrappers match tds-table-body-input-wrapper and -header-input-wrapper', () => {
  it('moves focus to the next editable cell on Enter', () => {
    render(
      <>
        <TableBodyInputWrapper>
          <input aria-label="first" />
        </TableBodyInputWrapper>
        <TableBodyInputWrapper showIcon={false}>
          <input aria-label="second" />
        </TableBodyInputWrapper>
      </>,
    );
    fireEvent.keyDown(screen.getByLabelText('first'), { key: 'Enter' });
    expect(screen.getByLabelText('second')).toHaveFocus();
    expect(document.querySelectorAll('.tl-table-body-input-wrapper__icon')).toHaveLength(1);
  });

  it.each<[string, boolean, string]>([
    ['default', false, 'tl-table-header-input-wrapper--compact-design-false'],
    ['compact', true, 'tl-table-header-input-wrapper--compact-design-true'],
  ])('shows a search icon in the header filter, %s', (_name, compactDesign, want) => {
    const { container } = render(
      <TableHeaderInputWrapper compactDesign={compactDesign}>
        <input aria-label="filter" />
      </TableHeaderInputWrapper>,
    );
    expect(container.firstElementChild).toHaveClass(want);
    expect(screen.getByRole('img', { name: 'search' })).toBeInTheDocument();
  });
});

describe('TableToolbar matches tds-table-toolbar', () => {
  it('shows the title and the start and end content', () => {
    renderTable({ toolbar: { tableTitle: 'Vehicles', start: 'Start', end: 'End' } });
    const caption = screen.getByText('Vehicles').closest('caption') as HTMLElement;
    expect(caption).toHaveTextContent('VehiclesStartEnd');
  });

  it('opens the search field and sends tdsFilter with the lower-case query', () => {
    const onTdsFilter = vi.fn();
    renderTable({ toolbar: { filter: true, tdsSearchAriaLabel: 'Search', onTdsFilter } });
    const open = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(open);
    expect(open).toHaveAttribute('aria-expanded', 'true');
    const input = screen.getByRole('textbox', { name: 'Search' });
    expect(input).toHaveFocus();
    fireEvent.change(input, { target: { value: 'TRUCK' } });
    fireEvent.keyUp(input);
    expect(firstDetail(onTdsFilter)).toEqual({ tableId: 'vehicles', query: 'truck' });
  });

  it('closes an empty search field when focus leaves it', () => {
    renderTable({ toolbar: { filter: true, tdsSearchAriaLabel: 'Search' } });
    const open = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(open);
    fireEvent.blur(screen.getByRole('textbox', { name: 'Search' }), {
      relatedTarget: document.body,
    });
    expect(open).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('TableFooter matches tds-table-footer', () => {
  function renderFooter(props: TableFooterProps) {
    const onTdsPagination = vi.fn();
    const result = renderTable({
      table: { multiselect: true },
      footer: { pagination: true, pages: '4', onTdsPagination, ...props },
    });
    const buttons = [...result.root.querySelectorAll<HTMLButtonElement>('tfoot button')];
    return {
      ...result,
      onTdsPagination,
      buttons,
      page: result.root.querySelector('tfoot input') as HTMLInputElement,
    };
  }

  it('spans all columns, with the multiselect column', () => {
    const { root } = renderFooter({});
    expect((root.querySelector('tfoot td') as HTMLTableCellElement).colSpan).toBe(3);
  });

  it('shows the label with the page count', () => {
    renderFooter({});
    expect(screen.getByText(/of/)).toHaveTextContent('of 4 pages');
  });

  it('moves through the pages, disables the buttons at the ends and sends tdsPagination', () => {
    const { buttons, page, onTdsPagination } = renderFooter({});
    const [first, previous, next, last] = buttons as HTMLButtonElement[];
    expect(first).toBeDisabled();
    expect(previous).toBeDisabled();
    fireEvent.click(next as HTMLButtonElement);
    expect(page.value).toBe('2');
    expect(firstDetail(onTdsPagination)).toEqual({
      tableId: 'vehicles',
      paginationValue: 2,
      rowsPerPage: 10,
    });
    fireEvent.click(last as HTMLButtonElement);
    expect(page.value).toBe('4');
    expect(next).toBeDisabled();
    expect(previous).toBeEnabled();
  });

  it('restores the last page when the typed page is out of range', () => {
    const { page } = renderFooter({ paginationValue: '2' });
    fireEvent.change(page, { target: { value: '9' } });
    fireEvent.blur(page);
    expect(page.value).toBe('2');
    fireEvent.change(page, { target: { value: '3' } });
    fireEvent.keyDown(page, { key: 'Enter' });
    expect(page.value).toBe('3');
  });

  it('sends the rows per page when the selector changes', () => {
    const { onTdsPagination } = renderFooter({ rowsPerPageValues: '5, 25' });
    fireEvent.change(screen.getByRole('combobox', { name: 'Select rows per page' }), {
      target: { value: '25' },
    });
    expect(firstDetail(onTdsPagination)).toMatchObject({ paginationValue: 1, rowsPerPage: 25 });
  });

  it('sends no rows per page when rowsperpage is off', () => {
    const { buttons, onTdsPagination } = renderFooter({ rowsperpage: false });
    expect(screen.queryByRole('combobox')).toBeNull();
    fireEvent.click(buttons[2] as HTMLButtonElement);
    expect(firstDetail(onTdsPagination)).toEqual({ tableId: 'vehicles', paginationValue: 2 });
  });
});
