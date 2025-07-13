import { Request, Response } from 'express';
import whois from 'whois';
import util from 'util';
import dns from 'dns';

// แปลง whois.lookup ให้รองรับ async/await เพื่อให้เขียนโค้ดง่ายขึ้น
const lookup = util.promisify(whois.lookup);
const dnsLookup = util.promisify(dns.lookup);

export const getWhoisInfo = async (req: Request, res: Response) => {
  try {
    // ดึงชื่อโดเมนจาก URL parameter เช่น /api/whois/google.com
    const domain = req.params.domain;

    if (!domain) {
      return res.status(400).json({ message: 'enter your domain' });
    }

    // เรียกใช้งาน whois lookup
    const result = await lookup(domain);
    const { address, family } = await dnsLookup(domain, {family: 4});

    res.status(200).json({
      success: true,
      ip: address,
      family: family,
      data: result,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error while search with WHOIS',
      error: error,
    });
  }
};