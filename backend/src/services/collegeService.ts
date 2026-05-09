import prisma from '../lib/prismaClient';

interface GetCollegesParams {
  search?: string;
  location?: string;
  page?: number;
  limit?: number;
}

export const getAllColleges = async (params: GetCollegesParams) => {
  const { search, location, page = 1, limit = 10 } = params;

  const where: any = {};
  if (search) {
    where.name = { contains: search, mode: 'insensitive' };
  }
  if (location) {
    where.location = { contains: location, mode: 'insensitive' };
  }

  const [data, total] = await Promise.all([
    prisma.college.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { name: 'asc' }
    }),
    prisma.college.count({ where })
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
};

export const getCollegeById = async (id: number) => {
  return await prisma.college.findUnique({ where: { id } });
};

export const getCollegesByIds = async (ids: number[]) => {
  return await prisma.college.findMany({
    where: { id: { in: ids } }
  });
};
