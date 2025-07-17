import React, { useState } from 'react';
import {
    MagnifyingGlassIcon,
    GlobeAltIcon,
    PlayIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

const HomePage = () => {
    const [formData, setFormData] = useState({
        username: '',
        domain: '',
        password: ''
    });

    const [selectedTools, setSelectedTools] = useState({
        whois: false,
        whatMyName: false,
        haveIBeenPwned: false
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleToolToggle = (tool: string) => {
        setSelectedTools(prev => ({
            ...prev,
            [tool]: !prev[tool as keyof typeof prev]
        }));
    };

    const handleStartInvestigation = () => {
        console.log('Starting investigation with:', { formData, selectedTools });
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

                        {/* Input Fields Section */}
                        <div className="bg-white rounded-lg p-6 shadow-lg">
                            <div className="flex items-center gap-2 mb-6">
                                <MagnifyingGlassIcon className="w-5 h-5 text-gray-600" />
                                <h3 className="text-xl font-semibold text-gray-900">Input Fields</h3>
                            </div>

                            <div className="space-y-6">
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

                        <div className="space-y-6">
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                            </div>

                            {/* Password Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    placeholder="Enter password to check"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                            </div>

                            {/* Tool Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Select OSINT Tools
                                </label>
                                <div className="space-y-3">
                                    {[
                                        { key: 'whois', label: 'WHOIS' },
                                        { key: 'whatMyName', label: 'WhatMyName' },
                                        { key: 'haveIBeenPwned', label: 'Have I Been Pwned' }
                                    ].map((tool) => (
                                        <label key={tool.key} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedTools[tool.key as keyof typeof selectedTools]}
                                                onChange={() => handleToolToggle(tool.key)}
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <span className="ml-3 text-sm text-gray-700">{tool.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={handleStartInvestigation}
                                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
                                >
                                    <PlayIcon className="w-5 h-5" />
                                    Start Investigation
                                </button>

                                <button className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2">
                                    <ClockIcon className="w-5 h-5" />
                                    History
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;