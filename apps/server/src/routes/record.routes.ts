import { Router, Request, Response } from 'express'; // Router import hai
import { db } from '../db/index.js'; 
import { place } from '../db/schema.js';
import { count, sql } from 'drizzle-orm';

// YEH LINE CHANGE HUI HAI: Type define kar diya
const router: Router = Router(); 

router.get('/records', async (req: Request, res: Response) => {
  try {
    const search = (req.query.search as string) || "";
    const page = parseInt(req.query.page as string) || 1;
    let limit = parseInt(req.query.limit as string) || 50;

    if (limit > 1000) limit = 1000;
    const offset = (page - 1) * limit;

    const searchCondition = search 
      ? sql`${place.name} ILIKE ${`%${search}%`} OR ${place.address} ILIKE ${`%${search}%`}`
      : sql`1=1`;

    const data = await db
      .select()
      .from(place)
      .where(searchCondition)
      .limit(limit)
      .offset(offset);

    const totalResult = await db
      .select({ count: count() })
      .from(place)
      .where(searchCondition);

    const totalRecords = totalResult[0].count;
    const totalPages = Math.ceil(totalRecords / limit);

    res.json({
      success: true,
      data: data,
      pagination: {
        totalRecords,
        totalPages,
        currentPage: page,
        limit
      }
    });

  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

export default router;