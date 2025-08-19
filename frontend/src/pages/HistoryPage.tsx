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
import dayjs from 'dayjs';
import axios from 'axios'; // เพิ่ม axios import
import { useNavigate } from 'react-router-dom';

const HistoryPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [deletingCaseId, setDeletingCaseId] = useState<string | null>(null); // เพิ่ม loading state
    const itemsPerPage = 10;

    // Debounce search term
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setCurrentPage(1); // Reset to first page when search changes
        }, 500); // รอ 500ms หลังจากผู้ใช้หยุดพิมพ์

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const { data, isLoading, error, refetch } = useFetchAllHistory({
        rowPerPage: itemsPerPage,
        page: currentPage,
        searchName: debouncedSearchTerm // ใช้ debouncedSearchTerm แทน searchTerm
    });

    // Transform API data to match the expected format
    const transformedData = useMemo(() => {
        if (!data?.cases) return [];
        return data.cases
    }, [data]);

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
        isDeleting: boolean;
    }

    const ActionsCellRenderer: React.FC<ActionsCellRendererProps> = ({ caseId, onView, onDelete, isDeleting }) => (
        <div className="flex gap-2">
            <button
                onClick={() => onView(caseId)}
                className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                disabled={isDeleting}
            >
                <EyeIcon className="w-4 h-4" />
                View Details
            </button>
            <button
                onClick={() => onDelete(caseId)}
                disabled={isDeleting}
                className={`flex items-center gap-1 px-3 py-1 rounded-md transition-colors text-sm ${isDeleting
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
            >
                {isDeleting ? (
                    <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                        Deleting...
                    </>
                ) : (
                    <>
                        <TrashIcon className="w-4 h-4" />
                        Delete
                    </>
                )}
            </button>
        </div>
    );

    // ✅ แก้ไข handleDelete ให้ยิง API จริง
    const handleDelete = async (caseId: string) => {
        // แสดง confirmation dialog
        const isConfirmed = window.confirm(`Are you sure you want to delete case "${caseId}"? This action cannot be undone.`);

        if (!isConfirmed) return;

        try {
            setDeletingCaseId(caseId); // แสดง loading state

            // ยิง API delete
            const response = await axios.delete('http://localhost:3000/api/delete', {
                data: {
                    case_id: caseId
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('Delete response:', response.data);

            // แสดงข้อความสำเร็จ
            alert('Case deleted successfully!');

            // Refresh ข้อมูลหลังจากลบสำเร็จ
            await refetch();

        } catch (error: any) {
            console.error('Error deleting case:', error);

            // แสดง error message
            const errorMessage = error.response?.data?.message || error.message || 'Failed to delete case.';
            alert(`Failed to delete case: ${errorMessage}`);

        } finally {
            setDeletingCaseId(null); // ซ่อน loading state
        }
    };

    function handleViewDetails(caseId: string) {
        console.log('View details for:', caseId);
        // TODO: Navigate to results page หรือแสดง modal
        navigate(`/results/${caseId}`);

    }

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
        {
            field: 'created_at', headerName: 'Date Searched', minWidth: 150, valueFormatter: params => {
                if (params.value) {
                    return dayjs(params.value).format('DD/MM/YYYY HH:mm');
                }
                return '';
            }
        },
        {
            headerName: 'Actions',
            minWidth: 300,
            cellRenderer: (params: import('ag-grid-community').ICellRendererParams) => {
                return (
                    <ActionsCellRenderer
                        caseId={params.data.case_id} // ✅ แก้เป็น case_id
                        onView={handleViewDetails}
                        onDelete={handleDelete}
                        isDeleting={deletingCaseId === params.data.case_id}
                    />
                );
            }
        }
    ];

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
                    <button
                        onClick={() => navigate('/')}
                        className="bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 p-4 rounded-lg border border-blue-200 hover:border-blue-300 hover:shadow-md transition-all duration-300"
                    >
                        Home Page
                    </button>


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