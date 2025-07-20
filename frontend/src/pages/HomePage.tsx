import React, { useState } from 'react';
import {
    MagnifyingGlassIcon,
    GlobeAltIcon,
    PlayIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

import { useFetchResultsMutation } from "../services/api/hooks/useResult"
import type {
    ResultBody,
    InfoData
} from '../services/api/types/result';

const HomePage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        caseName: '',
        username: '',
        domain: '',
        password: ''
    });

    const [selectedTools, setSelectedTools] = useState({
        whois: false,
        whatMyName: false,
        haveIBeenPwned: false
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { mutate: fetchResults, isPending } = useFetchResultsMutation();

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleToolToggle = (tool: string) => {
        setSelectedTools(prev => ({
            ...prev,
            [tool]: !prev[tool as keyof typeof prev]
        }));
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        // Validate case name
        if (!formData.caseName.trim()) {
            newErrors.caseName = 'Case name is required';
        }

        // Check if at least one tool is selected
        if (!Object.values(selectedTools).some(selected => selected)) {
            newErrors.tools = 'Please select at least one OSINT tool';
        }

        // Check if at least one input field has data
        if (!formData.username.trim() && !formData.domain.trim() && !formData.password.trim()) {
            newErrors.inputs = 'Please enter at least one target (username, domain, or password)';
        }

        // Validate domain format if provided
        if (formData.domain.trim()) {
            const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
            if (!domainRegex.test(formData.domain.trim())) {
                newErrors.domain = 'Please enter a valid domain name (e.g., example.com)';
            }
        }

        // Validate username if provided
        if (formData.username.trim() && formData.username.trim().length < 2) {
            newErrors.username = 'Username must be at least 2 characters long';
        }

        // Validate password if provided
        if (formData.password.trim() && formData.password.trim().length < 4) {
            newErrors.password = 'Password must be at least 4 characters long';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleStartInvestigation = async () => {
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        const toolsToRun: string[] = [];
        try {
            // Build parameters object based on selected tools and inputs
            const parameters: InfoData = {};

            if (formData.username.trim() && selectedTools.whatMyName) {
                parameters.username = formData.username.trim();
                toolsToRun.push('whatmyname');
            }

            if (formData.domain.trim() && selectedTools.whois) {
                parameters.domain = formData.domain.trim();
                toolsToRun.push('whois');
            }

            if (formData.password.trim() && selectedTools.haveIBeenPwned) {
                parameters.password = formData.password.trim();
                toolsToRun.push('hibp');
            }

            // Final validation - ensure at least one parameter matches selected tool
            if (Object.keys(parameters).length === 0) {
                setErrors({
                    match: 'Please ensure you have entered data for the tools you selected'
                });
                return;
            }

            // Prepare API request body
            const requestBody: ResultBody = {
                case_name: formData.caseName.trim(),
                parameters: parameters,
                tools_to_run: toolsToRun

            };

            console.log('Starting investigation with:', requestBody);

            // Call API with better error handling
            fetchResults(requestBody, {
                onSuccess: (response) => {
                    console.log('Investigation started successfully:', response);
                    // Navigate to results page with request number
                    navigate(`/results/`, { state: { response, case_name: requestBody.case_name } });

                    // Reset form on success
                    setFormData({
                        caseName: '',
                        username: '',
                        domain: '',
                        password: ''
                    });
                    setSelectedTools({
                        whois: false,
                        whatMyName: false,
                        haveIBeenPwned: false
                    });
                },
                onError: (error: any) => {
                    console.error('Failed to start investigation:', error);

                    // Handle specific error types
                    if (error?.response?.status === 400) {
                        setErrors({
                            api: 'Invalid request data. Please check your inputs.'
                        });
                    } else if (error?.response?.status === 429) {
                        setErrors({
                            api: 'Rate limit exceeded. Please try again later.'
                        });
                    } else if (error?.response?.status >= 500) {
                        setErrors({
                            api: 'Server error. Please try again later.'
                        });
                    } else {
                        setErrors({
                            api: 'Failed to start investigation. Please try again.'
                        });
                    }
                }
            });

        } catch (error) {
            console.error('Unexpected error:', error);
            setErrors({
                api: 'An unexpected error occurred. Please try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const hasToolDataMismatch = () => {
        const toolDataMap = {
            whois: formData.domain.trim(),
            whatMyName: formData.username.trim(),
            haveIBeenPwned: formData.password.trim()
        };

        return Object.entries(selectedTools).some(([tool, selected]) =>
            selected && !toolDataMap[tool as keyof typeof toolDataMap]
        );
    };

    const getSelectedToolsCount = () => {
        return Object.values(selectedTools).filter(Boolean).length;
    };

    const getFilledFieldsCount = () => {
        return [formData.username, formData.domain, formData.password]
            .filter(field => field.trim()).length;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-20">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h1 className="text-5xl font-bold text-blue-400 mb-6">InfoScope</h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        A comprehensive platform for gathering and utilizing various OSINT (Open
                        Source Intelligence) tools. Streamline your intelligence gathering process
                        with our integrated suite of professional-grade tools.
                    </p>
                    <div className="flex justify-center gap-6 mt-8">
                        <span className="px-4 py-2 bg-gray-700 rounded-full text-sm">Secure</span>
                        <span className="px-4 py-2 bg-gray-700 rounded-full text-sm">Professional</span>
                        <span className="px-4 py-2 bg-gray-700 rounded-full text-sm">Comprehensive</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Left Column - Information */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Intelligence Gathering Made Simple
                            </h2>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Enter the target information below and select the OSINT tools you want to
                                utilize. Our platform will aggregate results from multiple sources to provide
                                comprehensive intelligence.
                            </p>
                        </div>

                        {/* Status Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white rounded-lg p-4 shadow-sm border">
                                <div className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getSelectedToolsCount() > 0 ? 'bg-green-100' : 'bg-gray-100'
                                        }`}>
                                        {getSelectedToolsCount() > 0 ? (
                                            <CheckCircleIcon className="w-5 h-5 text-green-600" />
                                        ) : (
                                            <GlobeAltIcon className="w-5 h-5 text-gray-400" />
                                        )}
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">Tools Selected</p>
                                        <p className="text-xs text-gray-500">{getSelectedToolsCount()}/3 selected</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-4 shadow-sm border">
                                <div className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getFilledFieldsCount() > 0 ? 'bg-blue-100' : 'bg-gray-100'
                                        }`}>
                                        {getFilledFieldsCount() > 0 ? (
                                            <CheckCircleIcon className="w-5 h-5 text-blue-600" />
                                        ) : (
                                            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                                        )}
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">Fields Filled</p>
                                        <p className="text-xs text-gray-500">{getFilledFieldsCount()}/3 completed</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Warning for tool-data mismatch */}
                        {hasToolDataMismatch() && (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                <div className="flex">
                                    <ExclamationTriangleIcon className="h-5 w-5 text-amber-400 mt-0.5" />
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-amber-800">
                                            Missing Required Data
                                        </h3>
                                        <p className="text-sm text-amber-700 mt-1">
                                            Some selected tools require data that hasn't been provided:
                                        </p>
                                        <ul className="text-xs text-amber-600 mt-2 list-disc list-inside">
                                            {selectedTools.whois && !formData.domain.trim() && (
                                                <li>WHOIS requires a domain name</li>
                                            )}
                                            {selectedTools.whatMyName && !formData.username.trim() && (
                                                <li>WhatMyName requires a username</li>
                                            )}
                                            {selectedTools.haveIBeenPwned && !formData.password.trim() && (
                                                <li>Have I Been Pwned requires a password</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Input Fields Section */}
                        <div className="bg-white rounded-lg p-6 shadow-lg">
                            <div className="flex items-center gap-2 mb-6">
                                <MagnifyingGlassIcon className="w-5 h-5 text-gray-600" />
                                <h3 className="text-xl font-semibold text-gray-900">Input Fields</h3>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Case Name</h4>
                                    <p className="text-sm text-gray-600">Give your investigation a descriptive name</p>
                                </div>

                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Username</h4>
                                    <p className="text-sm text-gray-600">Target username or handle to investigate across platforms</p>
                                </div>

                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Domain Name</h4>
                                    <p className="text-sm text-gray-600">Website or domain to perform reconnaissance on</p>
                                </div>

                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Password</h4>
                                    <p className="text-sm text-gray-600">Check if credentials have been compromised in data breaches</p>
                                </div>
                            </div>
                        </div>

                        {/* Available Tools Section */}
                        <div className="bg-white rounded-lg p-6 shadow-lg">
                            <div className="flex items-center gap-2 mb-6">
                                <GlobeAltIcon className="w-5 h-5 text-gray-600" />
                                <h3 className="text-xl font-semibold text-gray-900">Available OSINT Tools</h3>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">WHOIS</h4>
                                    <p className="text-sm text-gray-600">Retrieve domain registration information and ownership details</p>
                                </div>

                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">WhatMyName</h4>
                                    <p className="text-sm text-gray-600">Search for usernames across hundreds of social media platforms</p>
                                </div>

                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Have I Been Pwned</h4>
                                    <p className="text-sm text-gray-600">Check if accounts or passwords have been compromised in data breaches</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Investigation Form */}
                    <div className="bg-white rounded-lg p-8 shadow-lg h-fit">
                        <div className="flex items-center gap-2 mb-8">
                            <GlobeAltIcon className="w-6 h-6 text-blue-600" />
                            <h3 className="text-2xl font-semibold text-gray-900">Investigation Parameters</h3>
                        </div>

                        {/* API Error Display */}
                        {(errors.api || errors.tools || errors.inputs || errors.match) && (
                            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex">
                                    <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">Error</h3>
                                        <div className="text-sm text-red-700 mt-1">
                                            {errors.api && <p>{errors.api}</p>}
                                            {errors.tools && <p>{errors.tools}</p>}
                                            {errors.inputs && <p>{errors.inputs}</p>}
                                            {errors.match && <p>{errors.match}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-6">
                            {/* Case Name Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Case Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.caseName}
                                    onChange={(e) => handleInputChange('caseName', e.target.value)}
                                    placeholder="Enter case name"
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${errors.caseName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                />
                                {errors.caseName && (
                                    <p className="mt-1 text-sm text-red-600">{errors.caseName}</p>
                                )}
                            </div>

                            {/* Username Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => handleInputChange('username', e.target.value)}
                                    placeholder="Enter target username"
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${errors.username ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                />
                                {errors.username && (
                                    <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                                )}
                            </div>

                            {/* Domain Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Domain Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.domain}
                                    onChange={(e) => handleInputChange('domain', e.target.value)}
                                    placeholder="example.com"
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${errors.domain ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                />
                                {errors.domain && (
                                    <p className="mt-1 text-sm text-red-600">{errors.domain}</p>
                                )}
                            </div>

                            {/* Password Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <input
                                    type="text"
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    placeholder="Enter password to check"
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>

                            {/* Tool Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Select OSINT Tools <span className="text-red-500">*</span>
                                </label>
                                <div className="space-y-3">
                                    {[
                                        { key: 'whois', label: 'WHOIS', indicator: 'domain', field: formData.domain },
                                        { key: 'whatMyName', label: 'WhatMyName', indicator: 'username', field: formData.username },
                                        { key: 'haveIBeenPwned', label: 'Have I Been Pwned', indicator: 'password', field: formData.password }
                                    ].map((tool) => (
                                        <label key={tool.key} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${selectedTools[tool.key as keyof typeof selectedTools]
                                            ? 'border-blue-200 bg-blue-50'
                                            : 'border-gray-200 hover:bg-gray-50'
                                            }`}>
                                            <input
                                                type="checkbox"
                                                checked={selectedTools[tool.key as keyof typeof selectedTools]}
                                                onChange={() => handleToolToggle(tool.key)}
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <div className="ml-3 flex-1">
                                                <span className="text-sm font-medium text-gray-700">
                                                    {tool.label}
                                                </span>
                                                <span className="text-gray-400 text-xs ml-2">
                                                    (requires {tool.indicator})
                                                </span>
                                                {selectedTools[tool.key as keyof typeof selectedTools] && !tool.field.trim() && (
                                                    <div className="text-xs text-amber-600 mt-1">
                                                        ⚠️ Missing required {tool.indicator}
                                                    </div>
                                                )}
                                                {selectedTools[tool.key as keyof typeof selectedTools] && tool.field.trim() && (
                                                    <div className="text-xs text-green-600 mt-1">
                                                        ✓ Ready to investigate
                                                    </div>
                                                )}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={handleStartInvestigation}
                                    disabled={isPending || isSubmitting || hasToolDataMismatch()}
                                    className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 ${isPending || isSubmitting || hasToolDataMismatch()
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                >
                                    <PlayIcon className="w-5 h-5" />
                                    {isPending || isSubmitting ? 'Starting Investigation...' : 'Start Investigation'}
                                </button>

                                <button
                                    onClick={() => navigate('/history')}
                                    className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
                                >
                                    <ClockIcon className="w-5 h-5" />
                                    History
                                </button>
                            </div>

                            {/* Investigation Summary */}
                            {(getSelectedToolsCount() > 0 || getFilledFieldsCount() > 0) && (
                                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Investigation Summary</h4>
                                    <div className="text-xs text-gray-600 space-y-1">
                                        <p>• {getSelectedToolsCount()} tool(s) selected</p>
                                        <p>• {getFilledFieldsCount()} field(s) completed</p>
                                        {formData.caseName.trim() && <p>• Case: "{formData.caseName.trim()}"</p>}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;