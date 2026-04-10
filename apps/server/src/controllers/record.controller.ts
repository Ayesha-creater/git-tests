import { Request, Response } from "express";
import { recordService } from "../services/record.service";

export const recordController = {
  // GET Route Handler
  async getRecords(req: Request, res: Response) {
    try {
     
      const page = String(req.query.page || "1");
      const search = String(req.query.search || "");

      const result = await recordService.getRecords(page, search);

      res.status(200).json({
        success: true,
        data: result.data,
        totalPages: result.totalPages,
        totalRecords: result.totalRecords,
      });
    } catch (error) {
      console.error("Error fetching records:", error);
      res.status(500).json({ 
        success: false, 
        message: "Internal Server Error" 
      });
    }
  },
};