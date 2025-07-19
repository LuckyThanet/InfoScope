// สามารถเพิ่มฟังก์ชันนี้เข้าไปในไฟล์ controller ที่มีอยู่ได้เลย
import { Request, Response } from "express";
import db from '../database/database';

export const deleteCaseById = async (req: Request, res: Response) => {

  try {

    const caseId = parseInt(req.params.body, 10);
    // const caseId = parseInt(req.body.id, 10);

    if (isNaN(caseId)) {
      return res.status(400).json({ success: false, message: 'Invalid Case ID' });
    }

    // 1. ค้นหาเคสที่ต้องการลบด้วย findByPk
    const caseToDelete = await db.Case.findByPk(caseId);

    // 2. ตรวจสอบว่าเจอเคสหรือไม่
    if (!caseToDelete) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    // 3. ถ้าเจอ ให้สั่งลบด้วย .destroy()
    await caseToDelete.destroy();

    // 4. ส่ง response ว่าลบสำเร็จ (status 204 คือ No Content เหมาะสำหรับการลบ)
    return res.status(204).send();

  } catch (error) {
    console.error('Failed to delete case:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete case'
    });
  }
};