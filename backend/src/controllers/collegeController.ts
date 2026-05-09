import { Request, Response } from 'express';
import * as collegeService from '../services/collegeService';

export const getColleges = async (req: Request, res: Response) => {
  try {
    const { search, location, page, limit } = req.query;
    
    const params = {
      search: search as string,
      location: location as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    };

    const result = await collegeService.getAllColleges(params);
    res.json(result);
  } catch (error) {
    console.error("Error fetching colleges:", error);
    res.status(500).json({ error: 'Failed to fetch colleges' });
  }
};

export const getCollegeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const college = await collegeService.getCollegeById(Number(id));
    if (!college) {
      return res.status(404).json({ error: 'College not found' });
    }
    res.json(college);
  } catch (error) {
    console.error("Error fetching college:", error);
    res.status(500).json({ error: 'Failed to fetch college' });
  }
};

export const compareColleges = async (req: Request, res: Response) => {
  try {
    const { ids } = req.query;
    if (!ids || typeof ids !== 'string') {
      return res.status(400).json({ error: 'Please provide comma-separated ids to compare' });
    }
    
    const idArray = ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    if (idArray.length === 0 || idArray.length > 3) {
      return res.status(400).json({ error: 'Please provide between 1 and 3 valid college IDs' });
    }

    const colleges = await collegeService.getCollegesByIds(idArray);
    res.json(colleges);
  } catch (error) {
    console.error("Error comparing colleges:", error);
    res.status(500).json({ error: 'Failed to compare colleges' });
  }
};
