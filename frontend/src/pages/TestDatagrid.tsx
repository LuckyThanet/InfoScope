import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';

const columnDefs: ColDef[] = [
    { headerName: "Make", field: "make" },
    { headerName: "Model", field: "model" },
    { headerName: "Price", field: "price" }
];

const TestDatagrid = () => {

    const rowData = [
        { make: "Toyota", model: "Celica", price: 35000 },
        { make: "Ford", model: "Mondeo", price: 32000 },
        { make: "Porsche", model: "Boxster", price: 72000 }
    ];
    console.log("TestDatagrid rowData", rowData);
    return (
        <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
            <AgGridReact
                columnDefs={columnDefs}
                rowData={rowData}
            />
        </div>
    );
};

export default TestDatagrid;