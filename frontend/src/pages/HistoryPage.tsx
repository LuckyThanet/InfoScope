import React, { useState, useMemo } from 'react';
import {
    MagnifyingGlassIcon,
    EyeIcon,
    TrashIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';
import Table from '../components/common/Table';
import type { ColDef } from 'ag-grid-community';

interface CaseHistory {
    caseId: string;
    caseName: string;
    dateSearched: string;
    target?: string;
    toolsUsed?: string[];
    // status?: 'completed' | 'in-progress' | 'failed';
}

const HistoryPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Sample data
    const [caseData] = useState<CaseHistory[]>([
        {
            caseId: 'CASE-001',
            caseName: 'John Doe Investigation',
            dateSearched: '2024-01-15',
            target: 'johndoe',
            toolsUsed: ['WHOIS', 'WhatMyName'],
            // status: 'completed'
        },
        {
            caseId: 'CASE-002',
            caseName: 'Domain Analysis - example.com',
            dateSearched: '2024-01-14',
            target: 'example.com',
            toolsUsed: ['WHOIS'],
            // status: 'completed'
        },
        {
            caseId: 'CASE-003',
            caseName: 'Social Media Footprint',
            dateSearched: '2024-01-13',
            target: 'socialuser123',
            toolsUsed: ['WhatMyName', 'Have I Been Pwned'],
            // status: 'completed'
        },
        {
            caseId: 'CASE-004',
            caseName: 'Email Compromise Check',
            dateSearched: '2024-01-12',
            target: 'user@email.com',
            toolsUsed: ['Have I Been Pwned'],
            // status: 'failed'
        },
        {
            caseId: 'CASE-005',
            caseName: 'Digital Identity Mapping',
            dateSearched: '2024-01-11',
            target: 'digitaluser',
            toolsUsed: ['WHOIS', 'WhatMyName', 'Have I Been Pwned'],
            // status: 'in-progress'
        }
    ]);

    // Filter data based on search term
    const filteredData = useMemo(() => {
        if (!searchTerm) return caseData;
        return caseData.filter(item =>
            item.caseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.target?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [caseData, searchTerm]);

    // Action buttons component for the table
    interface ActionsCellRendererProps {
        caseId: string;
        onView: (caseId: string) => void;
        onDelete: (caseId: string) => void;
    }

    const ActionsCellRenderer: React.FC<ActionsCellRendererProps> = ({ caseId, onView, onDelete }) => (
        <div className="flex gap-2">
            <button
                onClick={() => onView(caseId)}
                className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
            >
                <EyeIcon className="w-4 h-4" />
                View Details
            </button>
            <button
                onClick={() => onDelete(caseId)}
                className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
            >
                <TrashIcon className="w-4 h-4" />
            </button>
        </div>
    );

    // AG Grid columns
    const columnDefs: ColDef<CaseHistory>[] = [
        { field: 'caseId', headerName: 'Case ID', minWidth: 120 },
        { field: 'caseName', headerName: 'Case Name', minWidth: 200 },
        { field: 'target', headerName: 'Target', minWidth: 150 },
        {
            field: 'toolsUsed',
            headerName: 'Tools Used',
            minWidth: 180,
            valueGetter: params => params.data?.toolsUsed?.join(', ') ?? ''
        },
        { field: 'dateSearched', headerName: 'Date Searched', minWidth: 130 },
        {
            headerName: 'Actions',
            minWidth: 160,
            cellRenderer: (params: import('ag-grid-community').ICellRendererParams) => {
                // Render the React component using React.createElement
                return (
                    <ActionsCellRenderer
                        caseId={params.data.caseId}
                        onView={handleViewDetails}
                        onDelete={handleDelete}
                    />
                );
            }
        }
    ];

    function handleViewDetails(caseId: string) {
        console.log('View details for:', caseId);
    }

    function handleDelete(caseId: string) {
        console.log('Delete case:', caseId);
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Case History</h1>
                    <p className="text-gray-600">View and manage your investigation case history</p>
                </div>

                {/* Search Section */}
                <div className="mb-6">
                    <div className="relative max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by Case Name..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                        <div className="text-2xl font-bold text-blue-700">{caseData.length}</div>
                        <div className="text-sm text-blue-600">Total Cases</div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <Table<CaseHistory>
                        rowData={filteredData}
                        columnDefs={columnDefs}
                    />
                </div>
            </div>
        </div>
    );
};

export default HistoryPage;