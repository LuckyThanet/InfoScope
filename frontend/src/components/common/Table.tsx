import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';


type TableProps<T> = {
    readonly rowData: T[];
    readonly columnDefs: ColDef<T>[];
};

function Table<T>({ rowData, columnDefs }: TableProps<T>) {
    return (
        <div className="ag-theme-quartz w-full h-[400px]">
            <AgGridReact<T>
                rowData={rowData}
                columnDefs={columnDefs}
                pagination={true}
                paginationPageSize={10}
                paginationPageSizeSelector={false}
            />
        </div>
    );
}

export default Table;