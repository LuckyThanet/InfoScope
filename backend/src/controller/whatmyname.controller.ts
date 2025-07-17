import { Request, Response } from "express";
import axios from "axios";
import data from "../storage/wmn-data.json";

const sitesObject = data.find((item: any) => item.sites);

if (!sitesObject) {
  throw new Error("Could not find the 'sites' array in the JSON data.");
}

const siteList = sitesObject.sites || [];

// console.log(siteList[0]);
// console.log(platforms[3].sites[0].name);

export const getWmn = async (req: Request, res: Response) => {
  // const account = req.params.account;
  const account = req.body.account;
  const found: string[] = [];

  const checks = siteList.map(async (site: any) => {
    const url = site.uri_check.replace("{account}", account);
    try {
      const res = await axios.get(url, {
        timeout: 10000,
        headers: site.headers || {},
      });
      // เช็ค status code
      if (res.status === site.e_code) {
        // ถ้ามี e_string ให้เช็คว่าข้อความนั้นอยู่ใน res.data
        if (site.e_string && !res.data.includes(site.e_string)) {
          return;
        }
        found.push(`${site.name}: ${url}`);
      }
      // เช็ค m_string ถ้า status ตรงกับ m_code
      else if (site.m_code && res.status === site.m_code) {
        if (site.m_string && res.data.includes(site.m_string)) {
          console.log(`Found: ${site.name} at ${url}`);
          found.push(`${site.name}: ${url}`);
        }
      }
    } catch (err: any) {
      console.log("Got Error on : ", site.uri_check);
    }
  });

  await Promise.allSettled(checks);
  return res.status(200).json({
    found: found,
  });
};
