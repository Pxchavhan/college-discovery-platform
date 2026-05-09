import prisma from '../lib/prismaClient';

export const saveCollege = async (userId: number, collegeId: number) => {
  const existing = await prisma.savedCollege.findUnique({
    where: { userId_collegeId: { userId, collegeId } }
  });
  if (existing) return existing;

  return await prisma.savedCollege.create({
    data: { userId, collegeId }
  });
};

export const unsaveCollege = async (userId: number, collegeId: number) => {
  await prisma.savedCollege.deleteMany({
    where: { userId, collegeId }
  });
  return true;
};

export const getSavedColleges = async (userId: number) => {
  return await prisma.savedCollege.findMany({
    where: { userId }
  });
};
