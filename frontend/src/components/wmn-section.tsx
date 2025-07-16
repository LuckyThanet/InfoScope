// src/pages/testApiPage.tsx
import { useState } from 'react';
import axios from 'axios';
// import { useQuery } from '@tanstack/react-query';

const Wmn = () => {
    const [account, setAccount] = useState<string>('');
    const [result, setResult] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const handleCheck = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`http://localhost:3000/api/wmn`, {
                account: account,
            });
            setResult(res.data.found);
            console.log(res.data.found);
            console.log(result);
        } catch (err: any) {
            setResult(err.response?.data?.message || 'Something went wrong.');
        }
        setLoading(false);
    };

    return (
        <div className="p-8 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4">WMN Account Check</h1>
            <input
                type="text"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="Enter Account name"
                className="border px-4 py-2 w-full mb-4"
            />
            <button
                onClick={handleCheck}
                className="bg-blue-500 text-white px-4 py-2 rounded"
                disabled={account.length === 0}
            >
                {loading ? 'Checking...' : 'Check'}
            </button>

            {result && (
                <div className="mt-4 p-4 border rounded bg-gray-50">
                    <ul>
                        {result.map((item, index) => (
                            <li key={index}>{item}</li> // ปรับตาม structure จริง
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
export default Wmn;
