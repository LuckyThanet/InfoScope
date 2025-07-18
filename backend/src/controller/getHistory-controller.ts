import { Request, Response } from "express";
import db from '../database/database';
import { Op, where } from "sequelize";
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

export const getHistory = async (req: Request, res: Response) => {

    // const body = _req.body;
    const rowPerPage = parseInt(req.body.rowPerPage as string) || 10;
    const page = parseInt(req.body.page as string) || 1;
    const searchName = req.body.searchName;

    try {

        const whereCondition: any = {};
        if (searchName) {
            whereCondition.case_name = {
                [Op.like]: `%${searchName}%` // ค้นหา case_name ที่มีคำว่า search อยู่
            };
        }

        const count = await db.Case.count({
            where: whereCondition,
            include: [{
                model: db.Indicator,
                as: 'indicators',
                // ใส่ attributes: [] เพื่อไม่ให้กระทบการนับ แต่ยังคง JOIN ได้
                attributes: [] 
            }],
            distinct: true,
            // ระบุ col ที่จะนับ distinct ให้ชัดเจน (แนะนำ)
            col: 'case_id'
        });

        
        const allCases = await db.Case.findAll({
            where: whereCondition,
            attributes: ['case_id', 'case_name', 'created_at'],
            include: [
                {
                    model: db.Indicator,
                    as: 'indicators',
                    attributes: ['indicator_id'],
                    include: [
                        {
                            model: db.Result,
                            as: 'results',
                            attributes: ['result_id'],
                            include: [
                                {
                                    model: db.Tool,
                                    as: 'toolData',
                                    attributes: ['tool_name']
                                }
                            ]
                        }
                    ]
                }
            ],
            limit: rowPerPage,
            offset: (page - 1) * rowPerPage,
            order: [
                ['created_at', 'DESC']
            ]
        });

        const plainCase = allCases.map(singleCase => singleCase.toJSON()) as CaseWithIncludes[];
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
            count: count, // จำนวนเคสทั้งหมด
            totalPages: Math.ceil(count / rowPerPage), // จำนวนหน้าทั้งหมด
            currentPage: page, // หน้าปัจจุบัน
            cases: formattedCases, // ข้อมูลเคสในหน้านี้
        });
    }
    catch (error) {
        console.error('Failed to create case:', error);
        return res.status(500).json({
            success: false,
        });
    }
}