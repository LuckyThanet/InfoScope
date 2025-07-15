import { Request, Response } from 'express';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const filePath = path.join(__dirname, '../wmn-data/wmn-data.json');
const platforms = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const sitesObject = platforms.find((item: any) => item.sites);

if (!sitesObject) {
  throw new Error("Could not find the 'sites' array in the JSON data.");
}

const siteList = sitesObject.sites;

// console.log(siteList[0]);
// console.log(platforms[3].sites[0].name);

export const getWmn = async (req: Request, res: Response) => {

    const account = req.params.account;
    // const account = req.body.account;
    const found: string[] = [];

    const checks = siteList.map(async (site: any) => {
    const url = site.uri_check.replace('{account}', account);
    try {
        const res = await axios.get(url, {
            timeout: 10000
        });
        if (res.status === 200) {
            found.push(`${site.name}: ${url}`);
        }
    } catch (err: any) {
        console.log("Got Error on : ",site.uri_check);
    }
    });
    
    await Promise.allSettled(checks);
    return res.status(200).json({
      found: found,
    });

};