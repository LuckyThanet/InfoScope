// src/pages/testApiPage.tsx
import { useState } from 'react';
import axios from 'axios';
// import { useQuery } from '@tanstack/react-query';

const Whois = () => {
    const [domain, setDomain] = useState<string>('');
    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleCheck = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`http://localhost:3000/api/whois`, {
                domain: domain,
            });
            console.log(res.data);
            setResult(res.data);
        } catch (err: any) {
            setResult(err.response?.data?.message || 'Something went wrong.');
        }
        setLoading(false);
    };

    return (
        <div className="p-8 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4">Whois Account Check</h1>
            <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="Enter Domain"
                className="border px-4 py-2 w-full mb-4"
            />
            <button
                onClick={handleCheck}
                className="bg-blue-500 text-white px-4 py-2 rounded"
                disabled={domain.length === 0}
            >
                {loading ? 'Checking...' : 'Check'}
            </button>

            {result && (
                <ul>
                    {Object.entries(result).map(([key, value], index) => (
                        <li key={index}>
                            <strong>{key}:</strong> {Array.isArray(value) ? value.join(', ') : value.toString()}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
export default Whois;
