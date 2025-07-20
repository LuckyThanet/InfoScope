import React, { useState } from 'react';
import {
    GlobeAltIcon,
    ShieldExclamationIcon,
    UserGroupIcon,
    ArrowTopRightOnSquareIcon,
    DocumentTextIcon,
    CalendarIcon,
    CheckCircleIcon,
    DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useFetchByIdResults, usePostResultsToSave } from '../services/api/hooks/useResult';
import { sendDataResults } from "../services/api/models/result"
import type {
    InvestigationResult,
    WhoisResultData,
    WhatMyNameResultData,
    HibpResultData,
    HistoryResponse,
    InvestigationResults
} from '../services/api/types/result';
import axios from 'axios';
import { exportResultsToCSV, exportResultsToJSON } from '../util/helper';

// Type guard functions with better validation
const isWhoisResult = (result: InvestigationResult): result is InvestigationResult & { result_data: WhoisResultData } => {
    return result.tool_name === 'whois' && result.result_data !== null;
};

const isWhatMyNameResult = (result: InvestigationResult): result is InvestigationResult & { result_data: WhatMyNameResultData } => {
    return result.tool_name === 'whatmyname' && result.result_data !== null && 'found' in result.result_data;
};

const isHibpResult = (result: InvestigationResult): result is InvestigationResult & { result_data: HibpResultData } => {
    return result.tool_name === 'hibp' && result.result_data !== null && 'breached' in result.result_data;
};

const ResultsPage: React.FC = () => {
    const { requestNo } = useParams<{ requestNo: string }>();
    const location = useLocation();
    const resultBody: HistoryResponse = location.state?.response;
    const case_name = location.state?.case_name;

    // Hooks ต้องเรียกที่ top level
    const { data, isLoading, error } = useFetchByIdResults(requestNo || '', !!requestNo);
    // const { mutate: saveResults, isPending: isSaving, error: saveError } = usePostResultsToSave();

    // State สำหรับ UI feedback
    const [isSaved, setIsSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false); // ✅ เพิ่ม loading state
    const navigate = useNavigate()
    console.log('requestNo:', requestNo);
    console.log('resultBody:', resultBody);
    console.log('data from hook:', data);

    const results = requestNo ? data : resultBody;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <div className="text-xl text-gray-600">Loading investigation results...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <div className="text-xl text-red-600 mb-2">Error loading results</div>
                    <div className="text-gray-600">{error?.message || 'Unknown error'}</div>
                </div>
            </div>
        );
    }

    // Check if results exist and have proper structure
    if (!results) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-xl text-gray-600 mb-4">No Results Available</div>
                    <div className="text-gray-500">No investigation data found.</div>
                </div>
            </div>
        );
    }

    // Check if results.data exists
    if (!results.data) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-xl text-gray-600 mb-4">Invalid Data Structure</div>
                    <div className="text-gray-500">The results data is not in the expected format.</div>
                    <div className="mt-4 text-sm text-gray-400">
                        Debug: {JSON.stringify(results, null, 2)}
                    </div>
                </div>
            </div>
        );
    }

    // Check if results.data.results exists and is an array
    if (!results.data.results || !Array.isArray(results.data.results)) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-xl text-gray-600 mb-4">No Investigation Results</div>
                    <div className="text-gray-500">No investigation results to display.</div>
                    <div className="mt-4 text-sm text-gray-400">
                        Case: {results.data.case_name || 'Unknown'}
                    </div>
                </div>
            </div>
        );
    }

    // Filter results by tool type with proper typing
    const whoisResults = results.data.results.filter(isWhoisResult);
    const usernameResults = results.data.results.filter(isWhatMyNameResult);
    const passwordResults = results.data.results.filter(isHibpResult);

    console.log('Filtered results:', {
        total: results.data.results.length,
        whois: whoisResults.length,
        username: usernameResults.length,
        password: passwordResults.length
    });

    // // ✅ แก้ไข handleSaveResults - ไม่รับ parameter
    // const handleSaveResults = () => {
    //     if (!results?.data) {
    //         console.error('No results data to save');
    //         return;
    //     }

    //     const saveData: InvestigationResults = {
    //         case_name: results.data.case_name || case_name || 'Investigation Results',
    //         results: results.data.results,
    //     };

    //     console.log('Saving results:', saveData);

    //     // เรียกใช้ mutation
    //     saveResults(saveData, {
    //         onSuccess: (response) => {
    //             console.log('Results saved successfully:', response);
    //             setIsSaved(true);
    //         },
    //         onError: (error) => {
    //             console.error('Error saving results:', error);
    //             alert('Failed to save results. Please try again.');
    //         }
    //     });
    // };
    const handleSaveResults = async (body: InvestigationResults) => {
        try {
            setIsSaving(true); // เริ่ม loading

            const response = await axios.post('http://localhost:3000/api/insert', body, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('Results saved:', response.data);
            setIsSaved(true);
            // Reset success state after 3 seconds
            // setTimeout(() => {
            //     setIsSaved(false);
            // }, 3000);
            navigate('/history')

        } catch (error: any) {
            console.error('Error saving results:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to save results.';
            alert(`Failed to save results: ${errorMessage}`);

        } finally {
            setIsSaving(false); // หยุด loading
        }
    };

    const handleExportCSV = () => {
        if (!results?.data) return;

        const exportData: InvestigationResults = {
            case_name: results.data.case_name || case_name || 'Investigation Results',
            results: results.data.results,
        };

        exportResultsToCSV(exportData);
    };

    const handleExportJSON = () => {
        if (!results?.data) return;

        const exportData: InvestigationResults = {
            case_name: results.data.case_name || case_name || 'Investigation Results',
            results: results.data.results,
        };

        exportResultsToJSON(exportData);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-center mb-4 text-blue-600">
                    OSINT Investigation Results
                </h1>
                <p className="text-center text-gray-600 mb-4">
                    {results.data.case_name || case_name}
                </p>
                {requestNo && (
                    <p className="text-center text-sm text-gray-500 mb-6">Request No: {requestNo}</p>
                )}
                <div className="h-1 w-32 bg-blue-500 mx-auto mb-10"></div>

                {/* Online Accounts Section */}
                {usernameResults.length > 0 && (
                    <div className="mb-8 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 flex justify-between items-center bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
                            <div className="flex items-center">
                                <UserGroupIcon className="h-6 w-6 text-blue-500 mr-2" />
                                <h2 className="text-xl font-semibold text-gray-800">Online Accounts Found</h2>
                            </div>
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {usernameResults.reduce((acc, result) => acc + (result.result_data.found?.length || 0), 0)} accounts
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Platform
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Username
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Link
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {usernameResults.flatMap((result, resultIndex) =>
                                        result.result_data.found?.map((account: any, accountIndex: number) => {
                                            let platform = 'Unknown Platform';
                                            let link = '';

                                            // Handle object format: { platform: "GitHub", link: "https://..." }
                                            if (typeof account === 'object' && account !== null) {
                                                platform = account.platform || account.site || 'Unknown Platform';
                                                link = account.link || account.url || '';
                                            }
                                            // Handle string format: "Platform: https://..."
                                            else if (typeof account === 'string' && account.includes(': ')) {
                                                const [platformPart, linkPart] = account.split(': ');
                                                platform = platformPart || 'Unknown Platform';
                                                link = linkPart || '';
                                            }
                                            // Handle plain string
                                            else if (typeof account === 'string') {
                                                platform = account;
                                            }

                                            return (
                                                <tr key={`${resultIndex}-${accountIndex}`} className={accountIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {platform}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {result.indicator_value}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                                                        {link ? (
                                                            <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center hover:underline">
                                                                {link}
                                                                <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
                                                            </a>
                                                        ) : (
                                                            <span className="text-gray-400">No link available</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        }) || []
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Domain Information Section */}
                {whoisResults.length > 0 && whoisResults.map((result, index) => (
                    <div key={index} className="mb-8 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
                            <div className="flex items-center">
                                <GlobeAltIcon className="h-6 w-6 text-blue-500 mr-2" />
                                <h2 className="text-xl font-semibold text-gray-800">Domain Information: {result.indicator_value}</h2>
                            </div>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                                    <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">IP Address</p>
                                    <p className="mt-1 text-base text-blue-600 font-mono">{result.result_data.ip || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0 h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                                    <GlobeAltIcon className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Domain Name</p>
                                    <p className="mt-1 text-base text-gray-900">{result.result_data.domain_name || result.indicator_value}</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0 h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                                    <ShieldExclamationIcon className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Registrar</p>
                                    <p className="mt-1 text-base text-gray-900">{result.result_data.registrar?.name || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0 h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                                    <CalendarIcon className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Creation Date</p>
                                    <p className="mt-1 text-base text-gray-900">{result.result_data.created_at || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0 h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                                    <CalendarIcon className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Expiration Date</p>
                                    <p className="mt-1 text-base text-gray-900">{result.result_data.expires_at || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0 h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                                    <CheckCircleIcon className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Status</p>
                                    <div className="mt-1">
                                        {(() => {
                                            const status = result.result_data.status;

                                            if (Array.isArray(status) && status.length > 0) {
                                                return status.map((statusItem: string, i: number) => (
                                                    <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-1 mb-1">
                                                        {statusItem}
                                                    </span>
                                                ));
                                            }

                                            if (status && typeof status === 'string') {
                                                return (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        {status}
                                                    </span>
                                                );
                                            }

                                            return <span className="text-gray-500">N/A</span>;
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Password Breach Section */}
                {passwordResults.length > 0 && passwordResults.map((result, index) => (
                    <div key={index} className="mb-8 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
                            <div className="flex items-center">
                                <ShieldExclamationIcon className="h-6 w-6 text-blue-500 mr-2" />
                                <h2 className="text-xl font-semibold text-gray-800">Password Security Analysis</h2>
                            </div>
                        </div>

                        {result.result_data.breached ? (
                            <div className="p-6 bg-red-50 border border-red-200 rounded-md mx-6 my-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <ExclamationTriangleIcon className="h-6 w-6 text-red-500" aria-hidden="true" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-lg font-medium text-red-800">⚠️ Password Compromise Detected</h3>
                                        <div className="mt-2 text-sm text-red-700">
                                            <p>{result.result_data.message}</p>
                                            {result.result_data.count && (
                                                <p className="mt-1 font-medium">
                                                    Found in <span className="font-bold">{result.result_data.count.toLocaleString()}</span> breaches
                                                </p>
                                            )}
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
                                        <h3 className="text-lg font-medium text-green-800">✅ Password Security: Good</h3>
                                        <div className="mt-2 text-sm text-green-700">
                                            <p>This password has not been found in any known data breaches.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {/* No Results Message */}
                {results.data.results.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg shadow-md">
                        <div className="text-gray-500 text-lg mb-2">🔍 No investigation results found</div>
                        <div className="text-gray-400 text-sm">The investigation did not return any results for this request.</div>
                    </div>
                )}
            </div>

            {/* Save Results Button - ✅ เพิ่ม loading UI */}
            {!requestNo && (
                <div className="flex justify-center items-center pb-8 gap-2">
                    <button
                        className={`
                            ${isSaved
                                ? 'bg-green-600 hover:bg-green-700'
                                : isSaving
                                    ? 'bg-gray-500 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'
                            } 
                            text-white rounded-full px-6 py-3 shadow-lg transition-colors duration-300 
                            flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                        onClick={() => !isSaving && !isSaved && handleSaveResults({
                            case_name: results.data.case_name || case_name || 'Investigation Results',
                            results: results.data.results,
                        })}
                        disabled={isSaving || isSaved}
                    >
                        {isSaving ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Saving Results...
                            </>
                        ) : isSaved ? (
                            <>
                                <CheckCircleIcon className="h-5 w-5" />
                                Saved Successfully!
                            </>
                        ) : (
                            <>
                                <CheckCircleIcon className="h-5 w-5" />
                                Save Results
                            </>
                        )}
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-full px-6 py-3 shadow transition-colors duration-200"
                    >
                        Home Page
                    </button>
                    <button
                        onClick={handleExportCSV}
                        className="group flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-xl px-6 py-3 shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                    >
                        <DocumentArrowDownIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                        Export CSV
                    </button>
                </div>
            )}
            {
                requestNo &&
                <div className="flex justify-center items-center pb-8 gap-3">
                    <button
                        onClick={() => navigate('/')}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-full px-6 py-2 shadow transition-colors duration-200"
                    >
                        Home Page
                    </button>
                    <button
                        onClick={() => navigate('/history')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-6 py-2 mr-4 shadow transition-colors duration-200"
                    >
                        History
                    </button>
                    <button
                        onClick={handleExportCSV}
                        className="group flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-xl px-6 py-3 shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                    >
                        <DocumentArrowDownIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                        Export CSV
                    </button>
                </div>
            }


            {/* Save Results Button - ✅ แก้ไขให้สมบูรณ์ */}
            {isSaving && (
                <div className="flex justify-center pb-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md w-full">
                        <div className="flex items-center mb-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                            <div className="text-sm text-blue-700 font-medium">
                                Saving your investigation results...
                            </div>
                        </div>
                        <div className="w-full bg-blue-100 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                        </div>
                        <div className="text-xs text-blue-600 mt-1">
                            Please wait, do not close this page.
                        </div>
                    </div>
                </div>
            )}

            {/* Success Message - ✅ เพิ่มข้อความสำเร็จ */}
            {isSaved && (
                <div className="flex justify-center pb-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md">
                        <div className="flex items-center">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                            <div className="text-sm text-green-700 font-medium">
                                Investigation results saved successfully!
                            </div>
                        </div>
                        <div className="text-xs text-green-600 mt-1">
                            You can now view this case in your history.
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResultsPage;