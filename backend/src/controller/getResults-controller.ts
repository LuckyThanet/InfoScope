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

export const getResult = async (_req: Request, res: Response) => {

    // const body = _req.body.id;
    const id = _req.params.id;

    try {
        const singleCase = await db.Case.findByPk(id, {
      include: [
        {
          model: db.Indicator,
          as: 'indicators',
          include: [
            // -------------------- แก้ไขโครงสร้างตรงนี้ --------------------
            // object ที่ 1 สำหรับ IndicatorType
            // object ที่ 2 สำหรับ Result
            {
              model: db.Result,
              as: 'results',
              attributes: ['result_id', 'result'],
              include: [
                { 
                  model: db.Tool,
                  as: 'toolData',
                  attributes: ['tool_name']
                }
              ]
            }
            // -----------------------------------------------------------
          ]
        }
      ]
    });

    if (!singleCase) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    // 4. ส่งข้อมูลทั้งหมดที่ดึงได้กลับไป
    return res.status(200).json({
      success: true,
      data: singleCase.toJSON()
    });

  } catch (error) {
    console.error('Failed to retrieve case:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve case'
    });
  }
}