// src/pages/testApiPage.tsx
import { useState } from 'react';
import axios from 'axios';
import sha1 from 'crypto-js/sha1';
// import { useQuery } from '@tanstack/react-query';

const Hibp = () => {
    const [password, setPassword] = useState<string>('');
    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleCheck = async () => {
        setLoading(true);
        const hash = sha1(password).toString().toUpperCase();
        console.log(hash);
        try {
            const res = await axios.post(`http://localhost:3000/api/hibp`, {
                hash: hash,
            });
            console.log(res.data.message);
            setResult(res.data.message);
        } catch (err: any) {
            setResult(err.response?.data?.message || 'Something went wrong.');
        }
        setLoading(false);
    };

    return (
        <div className="p-8 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4">HIBP Password Check</h1>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="border px-4 py-2 w-full mb-4"
            />
            <button
                onClick={handleCheck}
                className="bg-blue-500 text-white px-4 py-2 rounded"
                disabled={password.length === 0}
            >
                {loading ? 'Checking...' : 'Check'}
            </button>

            {result && (
                <div className="mt-4 p-4 border rounded bg-gray-50">{result}</div>
            )}
        </div>
    );
}
export default Hibp;
