// src/pages/testApiPage.tsx
import Hibp from '../components/hibp-section';
import Wmn from '../components/wmn-section';
import Whois from '../components/whois-section';
// import { useQuery } from '@tanstack/react-query';

const TestPage = () => {
    return (
        <div className="p-8 max-w-md mx-auto">
            <Hibp />
            <Wmn />
            <Whois />
        </div>
    );
}
export default TestPage;
