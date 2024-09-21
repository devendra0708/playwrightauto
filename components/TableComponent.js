class TableComponent {
    constructor(page, tableSelector) {
        this.page = page;
        this.tableSelector = tableSelector;
        this.rowSelector = `${this.tableSelector} tr`; // Row selector within the table
        this.headerSelector = `${this.tableSelector} th`; // Header selector
    }

    // Get all rows of the table
    async getAllRows() {
        return await this.page.$$(`${this.rowSelector}`);
    }

    // Get the header of the table
    async getTableHeaders() {
        const headers = await this.page.$$(`${this.headerSelector}`);
        return Promise.all(headers.map(async (header) => await header.textContent()));
    }

    // Get data from a specific cell in the table
    async getCellValue(rowIndex, columnIndex) {
        const rows = await this.getAllRows();
        const cells = await rows[rowIndex].$$('td'); // Get cells in the row
        return await cells[columnIndex].textContent();
    }

    // Click a button/link inside a cell (if needed)
    async clickButtonInCell(rowIndex, columnIndex, buttonSelector) {
        const rows = await this.getAllRows();
        const cells = await rows[rowIndex].$$('td');
        const button = await cells[columnIndex].$(buttonSelector);
        await button.click();
    }

    // Find row by specific cell value
    async findRowByCellValue(columnIndex, searchValue) {
        const rows = await this.getAllRows();

        for (let i = 0; i < rows.length; i++) {
            const cells = await rows[i].$$('td');
            const cellValue = await cells[columnIndex].textContent();

            if (cellValue.trim() === searchValue.trim()) {
                return rows[i];
            }
        }
        return null;
    }

    // Perform an action based on cell value
    async performActionInRowByCellValue(columnIndex, searchValue, buttonSelector) {
        const row = await this.findRowByCellValue(columnIndex, searchValue);

        if (row) {
            const cells = await row.$$('td');
            const button = await cells[columnIndex].$(buttonSelector);
            await button.click();
        } else {
            throw new Error(`Row with cell value "${searchValue}" not found in column ${columnIndex}`);
        }
    }

    // Get the number of rows in the table
    async getRowCount() {
        const rows = await this.getAllRows();
        return rows.length;
    }

    // Get the number of columns in the table (based on the first row)
    async getColumnCount() {
        const rows = await this.getAllRows();
        const firstRowCells = await rows[0].$$('td');
        return firstRowCells.length;
    }
}

module.exports = TableComponent;
