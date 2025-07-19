import axios from 'axios';
import fs from 'fs';
import path from 'path';
import limit from 'p-limit'; // 1. Import p-limit

const filePath = path.join(__dirname, '../storage/wmn-data.json');
const platforms = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
const sitesObject = platforms.flatMap((category: any) => category.sites || []);

export const runWhatMyName = async (account: string) => {
    const found: string[] = [];
    
    // 2. สร้างตัวจำกัด (limit) ให้ทำงานพร้อมกันได้ไม่เกิน 20 requests
    const pLimit = limit(20); 

    const checks = sitesObject.map((site: any) => {
        // 3. ครอบฟังก์ชัน async ของเราด้วย pLimit
        return pLimit(async () => {
            const url_check = site.uri_check.replace('{account}', account);
            const url_pretty = (site.uri_pretty || site.uri_check).replace('{account}', account);

            try {
                // เรายังคงใช้ timeout ที่เหมาะสม (เช่น 20 วิ) และ User-Agent ได้
                const res = await axios.get(url_check, {
                    timeout: 20000,
                    responseType: 'text',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    }
                });
                
                const responseBody = res.data;
                let isFound = false;

                if (res.status === site.e_code) {
                    if (site.m_string && responseBody.includes(site.m_string)) {
                        isFound = false;
                    } else if (site.e_string && responseBody.includes(site.e_string)) {
                        isFound = true;
                    } else if (!site.e_string && !site.m_string) {
                        isFound = true;
                    }
                }
                
                if (isFound) {
                    console.log("succuess \n");
                    found.push(`${site.name}: ${url_pretty}`);
                }
            } catch (err: any) {
                console.log(`Error checking ${site.name}:`/*, err.code || err.message*/);
            }
        });
    });
    
    // Promise.all หรือ Promise.allSettled ก็ได้ในกรณีนี้
    await Promise.all(checks);

    const formattedFoundData = found.map(line => {
        const delimiterIndex = line.indexOf(':');
        if (delimiterIndex === -1) {
            return { platform: line, link: '' };
        }
        const platform = line.substring(0, delimiterIndex).trim();
        const link = line.substring(delimiterIndex + 1).trim();
        return { platform, link };
    });

    return {
        found: formattedFoundData,
    };
};