import React, { useState, useMemo, useEffect } from 'react';
import {
    MagnifyingGlassIcon,
    EyeIcon,
    TrashIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';
import Table from '../components/common/Table';
import type { ColDef } from 'ag-grid-community';
import { useFetchAllHistory } from '../services/api/hooks/useHistory';
import type { HistoryEntry } from '../services/api/types/history'

// interface CaseHistory {
//     caseId: string;
//     caseName: string;
//     dateSearched: string;
//     toolsUsed?: string[];
// }

const HistoryPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setCurrentPage(1); // Reset to first page when search changes
        }, 500); // รอ 500ms หลังจากผู้ใช้หยุดพิมพ์

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const { data, isLoading, error } = useFetchAllHistory({
        rowPerPage: itemsPerPage,
        page: currentPage,
        searchName: debouncedSearchTerm // ใช้ debouncedSearchTerm แทน searchTerm
    });

    // Transform API data to match the expected format
    const transformedData = useMemo(() => {
        if (!data?.cases) return [];
        return data.cases
    }, [data]);

    // Filter data based on search term (now handled by API, but keeping for local filtering if needed)

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-lg text-gray-600">Loading case history...</div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-lg text-red-600">Error loading case history</div>
            </div>
        );
    }

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
    const columnDefs: ColDef<HistoryEntry>[] = [
        { field: 'case_id', headerName: 'Case ID', minWidth: 120 },
        { field: 'case_name', headerName: 'Case Name', minWidth: 200 },
        {
            field: 'tools',
            headerName: 'Tools Used',
            minWidth: 180,
            valueGetter: params => params.data?.tools?.join(', ') ?? ''
        },
        { field: 'created_at', headerName: 'Date Searched', minWidth: 130 },
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
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                // ลบ setCurrentPage(1) ออกจากตรงนี้เพราะจะจัดการใน useEffect แล้ว
                            }}
                            placeholder="Search by Case Name..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                        <div className="text-2xl font-bold text-blue-700">{data?.count || 0}</div>
                        <div className="text-sm text-blue-600">Total Cases</div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <Table<HistoryEntry>
                        rowData={transformedData}
                        columnDefs={columnDefs}
                    />
                </div>

                {/* Pagination */}
                {data && data.totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                        <div className="text-sm text-gray-700">
                            Showing page {data.currentPage} of {data.totalPages} ({data.count} total cases)
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeftIcon className="w-4 h-4" />
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, data.totalPages))}
                                disabled={currentPage === data.totalPages}
                                className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                                <ChevronRightIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryPage;