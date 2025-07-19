import { Request, Response } from 'express';
import { runWhois } from '../tools/whois';
import { runWhatMyName } from '../tools/whatmyname';
import { runHibp } from '../tools/hibp';

// สร้าง Type สำหรับฟังก์ชันของ tool เพื่อให้โค้ดปลอดภัยและชัดเจน
type ToolFunction = (input: string) => Promise<any>;

// สร้าง Map เพื่อจับคู่ชื่อ tool กับฟังก์ชัน โดยกำหนด Type ที่สร้างไว้
const toolFunctionMap: { [key: string]: ToolFunction } = {
  'whois': runWhois,
  'whatmyname': runWhatMyName,
  'hibp': runHibp,
};


export const startInvestigation = async (req: Request, res: Response) => {
  try {
    const { parameters, tools_to_run } = req.body;

    // ตรวจสอบว่าได้รับข้อมูลที่จำเป็นครบถ้วนหรือไม่
    if (!parameters || !tools_to_run || !Array.isArray(tools_to_run)) {
        return res.status(400).json({ success: false, message: 'Invalid request body' });
    }

    // สร้าง Array ของ Promises ที่จะรัน tool แต่ละตัว
    const promises = tools_to_run.map((toolName: string) => {
      // ค้นหาฟังก์ชันจาก Map
      const toolFunction = toolFunctionMap[toolName];
      
      if (toolFunction) {
        // กำหนด input สำหรับแต่ละ tool
        let input: string | undefined;
        if (toolName === 'whois') input = parameters.domain;
        if (toolName === 'whatmyname') input = parameters.username;
        if (toolName === 'hibp') input = parameters.password;
        
        // รันฟังก์ชันถ้ามี input
        if (input) {
            return toolFunction(input);
        }
      }
      return Promise.resolve(null); // ถ้าไม่เจอชื่อ tool หรือไม่มี input ให้ข้ามไป
    });

    // รันทุก Promises พร้อมกัน และรอจนกว่าทั้งหมดจะเสร็จ
    const results = await Promise.all(promises);

    const formattedResults = tools_to_run
      .map((toolName: string, index: number) => {
        const result_data = results[index];

        // ถ้า tool นั้นไม่ได้ถูกรัน หรือไม่มีผลลัพธ์ ให้ข้ามไป
        if (!result_data) {
          return null;
        }

        // สร้าง object ใหม่สำหรับผลลัพธ์แต่ละอัน
        let indicatorTypeName = '';
        let indicatorValue = '';

        if (toolName === 'whois') {
          indicatorTypeName = 'Domain Name';
          indicatorValue = parameters.domain;
        }
        if (toolName === 'whatmyname') {
          indicatorTypeName = 'Username';
          indicatorValue = parameters.username;
        }
        if (toolName === 'hibp') {
          indicatorTypeName = 'Password';
          indicatorValue = parameters.password;
        }

        return {
          tool_name: toolName.toLowerCase(), // ทำให้เป็นตัวพิมพ์เล็ก
          indicator_type_name: indicatorTypeName,
          indicator_value: indicatorValue,
          result_data
        };
      })
      .filter(Boolean); 

    // ประกอบร่าง Response สุดท้าย
    // const finalResponse = {
    //     formattedResults
    // };

    return res.status(200).json({
      success: true,
      data:{
        // case_name: 'Investigation Results',
        results: formattedResults
      }
    });

  } catch (error) {
    console.error('Investigation failed:', error);
    return res.status(500).json({ success: false, message: 'An error occurred during investigation.' });
  }
};