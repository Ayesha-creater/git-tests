import { recordRepository } from "../repositories/record.repository";

export const recordService = {
  async getRecords(page: string | number, search: string) {
    // Page ko number mein convert karo, agar NaN aaye toh default 1 bana do
    // Aur page kabhi 0 ya negative nahi ho sakta
    const currentPage = Math.max(1, parseInt(String(page), 10) || 1);

    // Repository ko call karo
    return await recordRepository.getPaginatedRecords(currentPage, search);
  },
};