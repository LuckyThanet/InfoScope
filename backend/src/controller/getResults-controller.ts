import { Request, Response } from "express";
import db from '../database/database';
import { CaseAttributes } from "../types/caseTypes";

interface FullCaseData {
  case_id: number;
  case_name: string;
  startDate: Date | string;
  created_at?: Date | string;
  updated_at?: Date | string;
  indicators?: {
    value: string;
    type: string;
    results?: {
      result: string;
      toolData?: {
        tool_name: string;
      }
    }[];
  }[];
}

export const getResult = async (_req: Request, res: Response) => {

    // const body = _req.body.id;
    const id = _req.params.id;

    try {
        const singleCase = await db.Case.findByPk(id, {
      attributes: ['case_name'], // ดึงแค่ case_name จากตาราง Case
      include: [
        {
          model: db.Indicator,
          as: 'indicators',
          attributes: ['value'], // ดึง value และ type (ที่เป็น string) จาก Indicator
          include: [
            {
              model: db.Result,
              as: 'results',
              attributes: ['result'], // ดึง result (ที่เป็น JSON string) จาก Result
              include: [
                {
                  model: db.Tool,
                  as: 'toolData',
                  attributes: ['tool_name'] // ดึง tool_name จาก Tool
                }
              ]
            }
          ]
        }
      ]
    });

    if (!singleCase) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    const plainCase = singleCase.toJSON() as FullCaseData;

    // 3. ส่วนที่เหลือของโค้ดจะทำงานได้ปกติ เพราะ TypeScript รู้จัก .indicators แล้ว
    const formattedResults = plainCase.indicators?.flatMap(indicator => 
      indicator.results?.map(result => {
        let parsedResultData = {};
        try {
          parsedResultData = JSON.parse(result.result);
        } catch (e) {
          parsedResultData = { raw_text: result.result };
        }
        return {
          tool_name: result.toolData?.tool_name,
          indicator_type_name: indicator.type,
          indicator_value: indicator.value,
          result_data: parsedResultData
        };
      }) || []
    ) || [];

    const finalResponse = {
      case_name: plainCase.case_name,
      results: formattedResults
    };

    // 4. ส่งข้อมูลทั้งหมดที่ดึงได้กลับไป
    return res.status(200).json({
      success: true,
      data: finalResponse
    });

  } catch (error) {
    console.error('Failed to retrieve case:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve case'
    });
  }
}