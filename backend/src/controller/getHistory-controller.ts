import { Request, Response } from "express";
import db from '../database/database';
import { CaseAttributes } from "../types/caseTypes";

interface CaseWithIncludes {
    case_id: number;
    case_name: string;
    created_at: Date | string;
    indicators?: {
        indicator_id: number;
        results?: {
            result_id: number;
            toolData: {
                tool_name: string;
            }
        }[];
    }[];
}

export const getHistory = async (_req: Request, res: Response) => {

    // const body = _req.body;

    try {
        const allCase = await db.Case.findAll({
            attributes: ['case_id', 'case_name', 'created_at'],
            include: [
                {
                model: db.Indicator,
                as: 'indicators',
                // ไม่ต้องการฟิลด์จาก Indicator เลย ให้ระบุเป็น array ว่าง
                attributes: ['indicator_id'], 
                include: [
                    {
                    model: db.Result,
                    as: 'results',
                    // ไม่ต้องการฟิลด์จาก Result เลย
                    attributes: ['result_id'],
                    include: [
                        {
                        model: db.Tool,
                        as: 'toolData',
                        // 2. เลือกว่าจะเอาฟิลด์ไหนจากตาราง "Tool" บ้าง
                        attributes: ['tool_name']
                        }
                    ]
                    }
                ]
                }
            ]

            
        });

        const plainCase = allCase.map(singleCase => singleCase.toJSON()) as CaseWithIncludes[];
        // console.log(plainCase);

        const formattedCases = plainCase.map(singleCase => {
      // ดึง tool_name ทั้งหมดที่อยู่ใน case นั้นๆ ออกมา
      const toolNames = singleCase.indicators?.flatMap(indicator => 
        indicator.results?.map(result => result.toolData.tool_name) || []
      ) || [];

      // ทำให้ tool_name ไม่ซ้ำกัน (ถ้าต้องการ)
      const uniqueTools = [...new Set(toolNames)];
      
      // คืนค่าเป็น object รูปแบบใหม่
      return {
        case_id: singleCase.case_id,
        case_name: singleCase.case_name,
        created_at: singleCase.created_at,
        tools: uniqueTools, // ส่ง array ของชื่อ tool กลับไป
      };
    });

        return res.status(200).json({
            success: true,
            case: formattedCases,
        });
    }
    catch (error) {
        console.error('Failed to create case:', error);
        return res.status(500).json({
            success: false,
        });
    }
}