import { Request, Response } from 'express';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const filePath = path.join(__dirname, '../storage/wmn-data.json');
const platforms = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

// const sitesObject = platforms.find((item: any) => item.sites);

// if (!sitesObject) {
//   throw new Error("Could not find the 'sites' array in the JSON data.");
// }

// const siteList = sitesObject.sites;

const sitesObject = platforms.flatMap((category: any) => category.sites || []);

// console.log(siteList[0]);
// console.log(platforms[3].sites[0].name);

const facebookSiteData = sitesObject.find((site: { name: string; }) => site.name === "Facebook");

export const getWmn = async (req: Request, res: Response) => {

    // const account = req.params.account;
    const account = req.body.account;
    const found: string[] = [];

    // const test = await axios.get(https://api.github.com/users/luckythanet);
    // console.log(test);
    // if(test.status == 200) {
    //     return;
    // }

    const checks = sitesObject.map(async (site: any) => {
        const url_check = site.uri_check.replace('{account}', account);
        const url_pretty = (site.uri_pretty || site.uri_check).replace('{account}', account);
        // console.log(url_check);

        try {
            // console.log(url_check : ${url_check});
            if (site.name == "Facebook") {
                console.log(url_check);
            }
            const res = await axios.get(url_check, {
                timeout: 10000,
                responseType: 'text',
            });
            const responseBody = res.data;

            let isFound = false;

            // 1. เช็ค Status Code ที่ถูกต้องตามที่ระบุในไฟล์ json
            if (res.status === site.e_code) {
                // console.log("200")
                console.log(`${site.name} : ${res.status}`);
                // 2. เช็คว่ามีข้อความที่บ่งบอกว่า "ไม่เจอ" หรือไม่
                if (site.m_string && responseBody.includes(site.m_string)) {
                    if (site.name == "Facebook") {
                        console.log("Condition one");
                    }
                    isFound = false; // ถ้าเจอข้อความ m_string แสดงว่าไม่พบโปรไฟล์
                }
                // 3. เช็คว่ามีข้อความที่ "ควรจะเจอ" หรือไม่ (ถ้า m_string ไม่เจอ)
                if (site.e_string && responseBody.includes(site.e_string)) {
                    isFound = true; // ถ้าเจอข้อความ e_string แสดงว่าพบโปรไฟล์
                }
                // 4. กรณีที่ไม่มีทั้ง e_string และ m_string แต่ status code ถูกต้อง
                else if (!site.e_string && !site.m_string) {
                    isFound = true;
                }
            }
            // console.log(site.name);
            console.log(`isFound of ${site.name} : ${isFound}\n`);
            if (isFound) {
                found.push(`${site.name}: ${url_pretty}`);
            }
        } catch (err: any) {
            // console.log(site.name, "");
            if (site.name == "Facebook") {
                console.log("Got Error on : ", err, " Status Code : ", res.status);
            }
        }
    });
    
    await Promise.allSettled(checks);
    return res.status(200).json({
        tool_id: 2,
        found: found,
    });

};