import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { MOCK_COLLEGES } from '../src/data/mockColleges';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("No DATABASE_URL");
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Start seeding...');
  
  // Clear existing colleges if any
  await prisma.savedCollege.deleteMany({});
  await prisma.college.deleteMany({});
  
  // Seed colleges
  for (const college of MOCK_COLLEGES) {
    const { id, createdAt, updatedAt, ...collegeData } = college;
    const createdCollege = await prisma.college.create({
      data: collegeData,
    });
    console.log(`Created college with id: ${createdCollege.id}`);
  }
  
  console.log('Seeding finished.');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
  });
