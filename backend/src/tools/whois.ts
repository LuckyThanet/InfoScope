import whois from 'whois';
import util from 'util';
import dns from 'dns';
import whoisParser from '../utils/whois/whoisParser';
import { ParsedWhois } from '../types/whois/parsedWhois';
// Define interfaces for type safety
interface WhoisResponse {
  success: boolean;
  ip?: string;
  family?: number;
  data?: string;
  message?: string;
  error?: any;
}

interface DnsLookupResult {
  address: string;
  family: number;
}

// แปลง whois.lookup ให้รองรับ async/await เพื่อให้เขียนโค้ดง่ายขึ้น
const lookup = util.promisify(whois.lookup);
const dnsLookup = util.promisify(dns.lookup);

export const runWhois = async (domain: string) => {
  try {

    console.log(domain);

    if (!domain) {
      return { 
        success: false,
        message: 'enter your domain' 
      };
    }

    // เรียกใช้งาน whois lookup
    const result: string = await lookup(domain) as string; 
    
    const dnsResult: DnsLookupResult = await dnsLookup(domain, { family: 4 }) as DnsLookupResult;
    
    const tmp = whoisParser({
      success: true,
      ip: dnsResult.address,
      family: dnsResult.family,
      data: result,
    });

    return {
      tool_id: 3,
      success: true,
      tmp
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Error while search with WHOIS',
      error: error.message || error,
    };
  }
};
