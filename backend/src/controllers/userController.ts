import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import * as userService from '../services/userService';
import * as collegeService from '../services/collegeService';

export const saveCollege = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { collegeId } = req.body;
    
    if (!collegeId) return res.status(400).json({ error: 'collegeId is required' });
    
    const saved = await userService.saveCollege(userId, Number(collegeId));
    res.status(201).json(saved);
  } catch (error) {
    console.error("Save college error:", error);
    res.status(500).json({ error: 'Failed to save college' });
  }
};

export const unsaveCollege = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { collegeId } = req.params;
    
    await userService.unsaveCollege(userId, Number(collegeId));
    res.json({ message: 'Removed from saved' });
  } catch (error) {
    console.error("Unsave college error:", error);
    res.status(500).json({ error: 'Failed to remove saved college' });
  }
};

export const getSavedColleges = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const savedRecords = await userService.getSavedColleges(userId);
    
    const collegeIds = savedRecords.map(sc => sc.collegeId);
    if (collegeIds.length === 0) {
      return res.json([]);
    }
    
    const colleges = await collegeService.getCollegesByIds(collegeIds);
    res.json(colleges);
  } catch (error) {
    console.error("Get saved error:", error);
    res.status(500).json({ error: 'Failed to fetch saved colleges' });
  }
};
