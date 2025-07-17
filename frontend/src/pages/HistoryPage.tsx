import React, { useState, useMemo } from 'react';
import {
    MagnifyingGlassIcon,
    EyeIcon,
    TrashIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';

interface CaseHistory {
    caseId: string;
    caseName: string;
    dateSearched: string;
    target?: string;
    toolsUsed?: string[];
    status?: 'completed' | 'in-progress' | 'failed';
}

const HistoryPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Sample data
    const [caseData] = useState<CaseHistory[]>([
        {
            caseId: 'CASE-001',
            caseName: 'John Doe Investigation',
            dateSearched: '2024-01-15',
            target: 'johndoe',
            toolsUsed: ['WHOIS', 'WhatMyName'],
            status: 'completed'
        },
        {
            caseId: 'CASE-002',
            caseName: 'Domain Analysis - example.com',
            dateSearched: '2024-01-14',
            target: 'example.com',
            toolsUsed: ['WHOIS'],
            status: 'completed'
        },
        {
            caseId: 'CASE-003',
            caseName: 'Social Media Footprint',
            dateSearched: '2024-01-13',
            target: 'socialuser123',
            toolsUsed: ['WhatMyName', 'Have I Been Pwned'],
            status: 'completed'
        },
        {
            caseId: 'CASE-004',
            caseName: 'Email Compromise Check',
            dateSearched: '2024-01-12',
            target: 'user@email.com',
            toolsUsed: ['Have I Been Pwned'],
            status: 'failed'
        },
        {
            caseId: 'CASE-005',
            caseName: 'Digital Identity Mapping',
            dateSearched: '2024-01-11',
            target: 'digitaluser',
            toolsUsed: ['WHOIS', 'WhatMyName', 'Have I Been Pwned'],
            status: 'in-progress'
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

    // Pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(start, start + itemsPerPage);
    }, [filteredData, currentPage]);

    const handleViewDetails = (caseId: string) => {
        console.log('View details for:', caseId);
        // Navigate to case details page
    };

    const handleDelete = (caseId: string) => {
        console.log('Delete case:', caseId);
        // Show confirmation dialog and delete
    };

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
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                        <div className="text-2xl font-bold text-green-700">
                            {caseData.filter(c => c.status === 'completed').length}
                        </div>
                        <div className="text-sm text-green-600">Completed</div>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
                        <div className="text-2xl font-bold text-yellow-700">
                            {caseData.filter(c => c.status === 'in-progress').length}
                        </div>
                        <div className="text-sm text-yellow-600">In Progress</div>
                    </div>
                    <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
                        <div className="text-2xl font-bold text-red-700">
                            {caseData.filter(c => c.status === 'failed').length}
                        </div>
                        <div className="text-sm text-red-600">Failed</div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Case ID
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Case Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Target
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tools Used
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date Searched
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedData.map((item, index) => (
                                    <tr key={item.caseId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                            {item.caseId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.caseName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700 bg-gray-50">
                                            {item.target}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-wrap gap-1">
                                                {item.toolsUsed?.map((tool, toolIndex) => (
                                                    <span
                                                        key={toolIndex}
                                                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                                                    >
                                                        {tool}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.dateSearched}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                item.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                item.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleViewDetails(item.caseId)}
                                                    className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                                                >
                                                    <EyeIcon className="w-4 h-4" />
                                                    View Details
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.caseId)}
                                                    className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                                    <span className="font-medium">
                                        {Math.min(currentPage * itemsPerPage, filteredData.length)}
                                    </span>{' '}
                                    of <span className="font-medium">{filteredData.length}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        <span className="sr-only">Previous</span>
                                        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                                    </button>
                                    {Array.from({ length: totalPages }).map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                currentPage === i + 1
                                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                            }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        <span className="sr-only">Next</span>
                                        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-6 text-center text-sm text-gray-500">
                    Showing {filteredData.length} of {caseData.length} cases
                </div>
            </div>
        </div>
    );
};

export default HistoryPage;