import React from 'react';
import {
    GlobeAltIcon,
    ShieldExclamationIcon,
    UserGroupIcon,
    ArrowTopRightOnSquareIcon,
    DocumentTextIcon,
    CalendarIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

// Types for our data
interface OnlineAccount {
    platform: string;
    username: string;
    link: string;
}

interface DomainInfo {
    ipAddress: string;
    domainName: string;
    registrar: string;
    creationDate: string;
    expirationDate: string;
    status: 'Active' | 'Inactive' | 'Expired';
}

interface PasswordBreach {
    count: number;
    breaches: string[];
    compromised: boolean;
}

const ResultsPage: React.FC = () => {
    // Sample data
    const onlineAccounts: OnlineAccount[] = [
        { platform: 'GitHub', username: 'user123', link: 'https://github.com/user123' },
        { platform: 'Twitter', username: 'user123', link: 'https://twitter.com/user123' },
        { platform: 'LinkedIn', username: 'user123', link: 'https://linkedin.com/in/user123' },
        { platform: 'Instagram', username: 'user123', link: 'https://instagram.com/user123' },
        { platform: 'Reddit', username: 'user123', link: 'https://reddit.com/u/user123' },
    ];

    const domainInfo: DomainInfo = {
        ipAddress: '192.168.1.100',
        domainName: 'example.com',
        registrar: 'GoDaddy Inc.',
        creationDate: '2015-03-15',
        expirationDate: '2025-03-15',
        status: 'Active'
    };

    const passwordBreach: PasswordBreach = {
        count: 2,
        breaches: ['Data breach 1', 'Data breach 2'],
        compromised: true
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-center mb-10 text-blue-600">
                    OSINT Investigation Results
                    <div className="h-1 w-32 bg-blue-500 mx-auto mt-2"></div>
                </h1>

                {/* Online Accounts Section */}
                <div className="mb-8 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 flex justify-between items-center bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
                        <div className="flex items-center">
                            <UserGroupIcon className="h-6 w-6 text-blue-500 mr-2" />
                            <h2 className="text-xl font-semibold text-gray-800">Online Accounts Found</h2>
                        </div>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {onlineAccounts.length} accounts
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Platform
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Username
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Link
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {onlineAccounts.map((account, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {account.platform}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {account.username}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                                            <a href={account.link} target="_blank" rel="noopener noreferrer" className="flex items-center hover:underline">
                                                {account.link}
                                                <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Domain Information Section */}
                <div className="mb-8 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
                        <div className="flex items-center">
                            <GlobeAltIcon className="h-6 w-6 text-blue-500 mr-2" />
                            <h2 className="text-xl font-semibold text-gray-800">Domain Information</h2>
                        </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                                <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">IP Address</p>
                                <p className="mt-1 text-base text-blue-600 font-mono">{domainInfo.ipAddress}</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex-shrink-0 h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                                <GlobeAltIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Domain Name</p>
                                <p className="mt-1 text-base text-gray-900">{domainInfo.domainName}</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex-shrink-0 h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                                <ShieldExclamationIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Registrar</p>
                                <p className="mt-1 text-base text-gray-900">{domainInfo.registrar}</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex-shrink-0 h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                                <CalendarIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Creation Date</p>
                                <p className="mt-1 text-base text-gray-900">{domainInfo.creationDate}</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex-shrink-0 h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                                <CalendarIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Expiration Date</p>
                                <p className="mt-1 text-base text-gray-900">{domainInfo.expirationDate}</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex-shrink-0 h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                                <CheckCircleIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Status</p>
                                <p className="mt-1">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${domainInfo.status === 'Active' ? 'bg-green-100 text-green-800' :
                                        domainInfo.status === 'Inactive' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                        {domainInfo.status}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Password Breach Section */}
                <div className="mb-8 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
                        <div className="flex items-center">
                            <ShieldExclamationIcon className="h-6 w-6 text-blue-500 mr-2" />
                            <h2 className="text-xl font-semibold text-gray-800">Password Breach History</h2>
                        </div>
                    </div>

                    {passwordBreach.compromised ? (
                        <div className="p-6 bg-red-50 border border-red-200 rounded-md mx-6 my-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <ExclamationTriangleIcon className="h-6 w-6 text-red-500" aria-hidden="true" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-lg font-medium text-red-800">Password Compromise Detected</h3>
                                    <div className="mt-2 text-sm text-red-700">
                                        <p>
                                            This password has been found in <span className="font-semibold">{passwordBreach.count} data breaches</span>.
                                            It is recommended to change this password immediately.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 bg-green-50 border border-green-200 rounded-md mx-6 my-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <CheckCircleIcon className="h-6 w-6 text-green-500" aria-hidden="true" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-lg font-medium text-green-800">No Password Breaches Found</h3>
                                    <div className="mt-2 text-sm text-green-700">
                                        <p>
                                            This password has not been found in any known data breaches.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResultsPage;