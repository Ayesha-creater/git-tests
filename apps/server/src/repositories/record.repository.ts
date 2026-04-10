import { db } from '../db/index.js'
import { place } from '../db/schema.js'
import { ilike, sql, desc } from 'drizzle-orm'

export const recordRepository = {
  async getPaginatedRecords(page: number, search: string) {
    const limit = 50;
    const offset = (page - 1) * limit;

    // Search condition: agar search hai toh 'name' column mein dhundho
    const whereCondition = search 
      ? ilike(place.name, `%${search}%`) 
      : undefined;

    // Data fetch karna
    const data = await db
      .select()
      .from(place)
      .where(whereCondition)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(place.id)); // Naye records pehle aayenge

    // Total count nikalna
    const totalCountResult = await db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(place)
      .where(whereCondition);

    const totalRecords = totalCountResult[0].count;
    const totalPages = Math.ceil(totalRecords / limit);

    return { data, totalPages, totalRecords };
  },
};