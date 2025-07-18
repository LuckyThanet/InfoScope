// import { Request, Response } from "express";
// import db from '../database/database';
// import { request } from "http";

// export const insertCase = async (_req: Request, res: Response) => {

//     // const body = _req.body;
//     const body = {
//         casename: "fdsfds",
//         indicator_value: "fdsfdsf",
//         indicator_type: 1,
//         result_value: "fdfdsf",
//         result_type: 1,
//         tool_id: 1,
//     };

//     try {
//         const newCaseData = {
//             startDate: new Date(),
//             case_name: 'Test Case 1' //casename
//         };

//         const newCaseRecord = await db.Case.create(newCaseData);

        

//         const newIndicatorData = {
//             type: 2, // indicator_type
//             value: "test indicator value", // indicator_value
//             case: newCaseRecord.get('case_id') as number, //case_id
//         };

//         const newIndicatorRecord = await db.Indicator.create(newIndicatorData);

//         const newResultData = {
//             result: "test result 1", // result_value
//             tool: 1, // tool_id
//             indicator: newIndicatorRecord.get('indicator_id') as number, // indicator_id
//             type: 3, //result_type
//         };

//         const newResultRecord = await db.Result.create(newResultData);

//         return res.status(200).json({
//             success: true,
//         });
//     }
//     catch (error) {
//         console.log("Got Error : ", error);
//         return res.status(500).json({
//             success: false,
//         })
//     }
// };

import { Request, Response } from "express";
import db from '../database/database';


const mockup = {
  "case_name": "Comprehensive Investigation for user123 & example.com",
  "results": [
    {
      "tool_name": "whois",
      "indicator_type_name": "Domain Name",
      "indicator_value": "pantib.com",
      "result_data": {
        "ip": "76.223.54.146",
        "domain_name": "pantib.com",
        "registrar": { "name": "GoDaddy.com, LLC" },
        "created_at": "2005-02-20",
        "updated_at": "2025-01-31",
        "expires_at": "2026-02-20",
        "status": ["clientTransferProhibited", "clientUpdateProhibited"],
        "name_servers": ["NS1.NAMEFIND.COM", "NS2.NAMEFIND.COM"],
        "dnssec": "unsigned"
      }
    },
    {
      "tool_name": "whatmyname",
      "indicator_type_name": "Username",
      "indicator_value": "luckythanet",
      "result_data": {
        "found": [
          "Disqus: https://disqus.com/by/luckythanet/",
          "GitHub: https://github.com/luckythanet"
        ]
      }
    },
    {
      "tool_name": "hibp",
      "indicator_type_name": "Password",
      "indicator_value": "user_entered_password",
      "result_data": {
        "breached": true,
        "count": 130075037,
        "message": "Password has been pwned 130075037 times."
      }
    }
  ]
};

export const insertCase = async (req: Request, res: Response) => {
  // เริ่มต้น Transaction
  const t = await db.sequelize.transaction();

  try {
    // const { case_name, results } = req.body;
    const { case_name, results } = mockup;

    // 1. สร้าง Case หลักก่อนภายใต้ Transaction
    const newCase = await db.Case.create({
      case_name: case_name || 'New Saved Investigation',
      startDate: new Date(),
    }, { transaction: t });
    
    const newCaseId = newCase.get('case_id') as number;

    // 2. วนลูปผ่าน results array ที่ส่งมา
    // เราใช้ for...of loop เพราะมันทำงานกับ await ได้ดีกว่า forEach
    for (const resultItem of results) {
      
      // 2.1 ค้นหา ID ของประเภท Indicator และ Tool
      const tool = await db.Tool.findOne({ where: { tool_name: resultItem.tool_name } });

      // ถ้าไม่เจอข้อมูลพื้นฐาน ให้ข้ามไป
      if (!tool) {
        console.warn(`Skipping result due to missing type or tool:`, resultItem);
        continue; 
      }

      // 2.2 ค้นหาหรือสร้าง Indicator เพื่อป้องกันข้อมูลซ้ำซ้อน
      const [indicator] = await db.Indicator.findOrCreate({
        where: {
          value: resultItem.indicator_value,
          type: resultItem.indicator_type_name,
          case: newCaseId,
        },
        transaction: t
      });
      const indicatorId = indicator.get('indicator_id') as number;

      // 2.3 สร้าง Result โดยแปลง result_data เป็น JSON string
      await db.Result.create({
        result: JSON.stringify(resultItem.result_data, null, 2), // แปลง object เป็น string
        tool: tool.get('tool_id') as number,
        indicator: indicatorId, // สมมติว่าประเภทผลลัพธ์มี id = 1 (อาจปรับเปลี่ยนตามระบบของคุณ)
      }, { transaction: t });
    }

    // 3. ถ้าทุกอย่างสำเร็จ ให้ commit transaction (ยืนยันการบันทึก)
    await t.commit();

    return res.status(201).json({
      success: true,
      message: 'Investigation results saved successfully.',
      case_id: newCaseId
    });

  } catch (error) {
    // 4. ถ้ามีข้อผิดพลาดเกิดขึ้น ให้ rollback (ยกเลิกการบันทึกทั้งหมด)
    await t.rollback();
    
    console.error('Failed to save investigation:', error);
    return res.status(500).json({ success: false, message: 'An error occurred while saving.' });
  }
};