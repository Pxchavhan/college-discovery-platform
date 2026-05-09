import dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import * as fs from 'fs';
import { parse } from 'csv-parse/sync';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// ─── Prisma Setup ─────────────────────────────────────────────────────────────
const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is not set.');
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ─── Course Mapping by College Type ───────────────────────────────────────────
const COURSES_BY_TYPE: Record<string, string[]> = {
  IIT:       ['B.Tech', 'M.Tech', 'PhD', 'MBA', 'MSc'],
  NIT:       ['B.Tech', 'M.Tech', 'MCA', 'PhD'],
  IIIT:      ['B.Tech', 'M.Tech', 'MS Research', 'PhD'],
  IIM:       ['MBA', 'PGDM', 'PhD', 'Executive MBA'],
  AIIMS:     ['MBBS', 'MD', 'MS', 'PhD', 'B.Sc Nursing'],
  BITS:      ['B.E.', 'M.E.', 'MBA', 'M.Phil', 'PhD'],
  NLU:       ['BA LLB', 'LLM', 'BBA LLB', 'PhD'],
  University:['B.Tech', 'MBA', 'MCA', 'B.Sc', 'M.Sc', 'PhD'],
  IISc:      ['B.Res', 'M.Tech', 'M.Sc', 'PhD'],
  Medical:   ['MBBS', 'BDS', 'B.Pharm', 'MD', 'MS'],
  Engineering:['B.Tech', 'M.Tech', 'Diploma'],
  Government:['B.Tech', 'MBA', 'MCA', 'B.Sc', 'M.Sc'],
  Private:   ['B.Tech', 'MBA', 'MCA', 'BBA', 'M.Tech'],
};

// ─── Description Generator ────────────────────────────────────────────────────
function generateDescription(name: string, type: string, city: string, state: string): string {
  const location = city ? `${city}, ${state}` : state;
  const typeDescriptions: Record<string, string> = {
    IIT:        `A prestigious Indian Institute of Technology located in ${location}, renowned for excellence in engineering and technology education.`,
    NIT:        `A National Institute of Technology in ${location}, offering high-quality technical education and strong industry connections.`,
    IIIT:       `An Indian Institute of Information Technology in ${location}, specializing in computer science and information technology programs.`,
    IIM:        `A top-ranked Indian Institute of Management in ${location}, known for producing India's leading business professionals.`,
    AIIMS:      `A premier All India Institute of Medical Sciences in ${location}, offering world-class medical education and healthcare.`,
    BITS:       `A top-ranked Birla Institute of Technology and Science campus in ${location}, known for its rigorous engineering programs.`,
    NLU:        `A National Law University in ${location}, offering premier legal education and producing top judicial and corporate lawyers.`,
    University: `A well-established university in ${location}, offering a diverse range of undergraduate and postgraduate programs.`,
    Medical:    `A reputable medical institution in ${location}, offering MBBS and postgraduate medical programs.`,
    Engineering:`A leading engineering institution in ${location}, providing technical education across multiple disciplines.`,
    Government: `A government-funded institution in ${location}, offering quality education at affordable fees.`,
    Private:    `A private institution in ${location}, offering a wide range of professional and technical programs.`,
  };
  return typeDescriptions[type] || `An educational institution in ${location} offering quality academic programs.`;
}

// ─── Raw CSV Row Interface ─────────────────────────────────────────────────────
interface CsvRow {
  name: string;
  city: string;
  state: string;
  type: string;
  fees_ug_inr: string;
  placement_avg_lpa: string;
  rating: string;
  nirf_rank: string;
}

// ─── Normalizer ───────────────────────────────────────────────────────────────
interface CollegeRecord {
  name: string;
  location: string;
  description: string;
  established: number | null;
  fees: number | null;
  placements: string;
  placementPct: number | null;
  rating: number | null;
  courses: string[];
}

function normalizeRow(row: CsvRow, rowIndex: number): CollegeRecord | null {
  const name = row.name?.trim().replace(/^"|"$/g, '');
  if (!name) {
    console.warn(`  [SKIP] Row ${rowIndex}: missing name`);
    return null;
  }

  const state = row.state?.trim();
  const city  = row.city?.trim();

  if (!state) {
    console.warn(`  [SKIP] "${name}" (row ${rowIndex}): missing state`);
    return null;
  }

  const location = city ? `${city}, ${state}` : state;

  // Fees: keep null if missing/zero
  const rawFees = parseFloat(row.fees_ug_inr);
  const fees = !isNaN(rawFees) && rawFees > 0 ? Math.round(rawFees) : null;

  // Placement avg package in LPA → store as string description + numeric pct
  const rawLpa = parseFloat(row.placement_avg_lpa);
  const avgLpa = !isNaN(rawLpa) && rawLpa > 0 ? rawLpa : null;
  const placements = avgLpa ? `Average package: ₹${avgLpa} LPA` : 'Placement data not available';
  
  // Normalize placementPct: clamp between 0-100, derive from LPA if missing
  // We use a sigmoid-like scale: 25 LPA → ~90%, 10 LPA → ~70%, 5 LPA → ~50%
  let placementPct: number | null = null;
  if (avgLpa !== null) {
    placementPct = Math.min(95, Math.round(40 + (avgLpa / 40) * 55));
  }

  // Rating: scale is already 1-10, clamp
  const rawRating = parseFloat(row.rating);
  const rating = !isNaN(rawRating) ? Math.min(10, Math.max(0, parseFloat(rawRating.toFixed(1)))) : null;

  // Courses by type
  const type = row.type?.trim() || 'Private';
  const courses = COURSES_BY_TYPE[type] || COURSES_BY_TYPE['Private'];

  const description = generateDescription(name, type, city, state);

  return { name, location, description, established: null, fees, placements, placementPct, rating, courses };
}

// ─── Main Import ──────────────────────────────────────────────────────────────
async function main() {
  const csvPath = path.resolve(__dirname, '../src/data/india_colleges.csv');

  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV file not found at: ${csvPath}`);
  }

  console.log('📂 Reading CSV file...');
  const raw = fs.readFileSync(csvPath, 'utf-8');

  const rows: CsvRow[] = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_quotes: true,
    relax_column_count: true,
  });

  console.log(`📊 Total rows in CSV: ${rows.length}`);

  // Normalize
  const records: CollegeRecord[] = [];
  const seen = new Set<string>();
  let skipped = 0;

  rows.forEach((row, i) => {
    const record = normalizeRow(row, i + 2); // +2 for header + 1-index
    if (!record) { skipped++; return; }

    const key = record.name.toLowerCase();
    if (seen.has(key)) {
      console.warn(`  [DUPLICATE] Skipping duplicate: "${record.name}"`);
      skipped++;
      return;
    }
    seen.add(key);
    records.push(record);
  });

  console.log(`✅ Valid records: ${records.length} | ⚠️  Skipped: ${skipped}`);

  // Clear existing and re-seed
  console.log('\n🗑️  Clearing existing college data...');
  await prisma.savedCollege.deleteMany({});
  await prisma.college.deleteMany({});

  // Batch insert in chunks of 50 for performance
  const CHUNK_SIZE = 50;
  let inserted = 0;

  console.log('🚀 Inserting colleges into PostgreSQL...\n');
  for (let i = 0; i < records.length; i += CHUNK_SIZE) {
    const chunk = records.slice(i, i + CHUNK_SIZE);
    await prisma.college.createMany({ data: chunk });
    inserted += chunk.length;
    process.stdout.write(`   Progress: ${inserted}/${records.length} colleges inserted\r`);
  }

  console.log(`\n\n✅ Import complete! ${inserted} colleges successfully imported.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('\n❌ Import failed:', e.message);
    await prisma.$disconnect();
  });
