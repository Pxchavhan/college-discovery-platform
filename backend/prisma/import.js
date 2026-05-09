"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path = __importStar(require("path"));
dotenv_1.default.config({ path: path.resolve(__dirname, '../.env') });
const fs = __importStar(require("fs"));
const sync_1 = require("csv-parse/sync");
const client_1 = require("@prisma/client");
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
// ─── Prisma Setup ─────────────────────────────────────────────────────────────
const connectionString = process.env.DATABASE_URL;
if (!connectionString)
    throw new Error('DATABASE_URL is not set.');
const pool = new pg_1.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
// ─── Course Mapping by College Type ───────────────────────────────────────────
const COURSES_BY_TYPE = {
    IIT: ['B.Tech', 'M.Tech', 'PhD', 'MBA', 'MSc'],
    NIT: ['B.Tech', 'M.Tech', 'MCA', 'PhD'],
    IIIT: ['B.Tech', 'M.Tech', 'MS Research', 'PhD'],
    IIM: ['MBA', 'PGDM', 'PhD', 'Executive MBA'],
    AIIMS: ['MBBS', 'MD', 'MS', 'PhD', 'B.Sc Nursing'],
    BITS: ['B.E.', 'M.E.', 'MBA', 'M.Phil', 'PhD'],
    NLU: ['BA LLB', 'LLM', 'BBA LLB', 'PhD'],
    University: ['B.Tech', 'MBA', 'MCA', 'B.Sc', 'M.Sc', 'PhD'],
    IISc: ['B.Res', 'M.Tech', 'M.Sc', 'PhD'],
    Medical: ['MBBS', 'BDS', 'B.Pharm', 'MD', 'MS'],
    Engineering: ['B.Tech', 'M.Tech', 'Diploma'],
    Government: ['B.Tech', 'MBA', 'MCA', 'B.Sc', 'M.Sc'],
    Private: ['B.Tech', 'MBA', 'MCA', 'BBA', 'M.Tech'],
};
// ─── Description Generator ────────────────────────────────────────────────────
function generateDescription(name, type, city, state) {
    const location = city ? `${city}, ${state}` : state;
    const typeDescriptions = {
        IIT: `A prestigious Indian Institute of Technology located in ${location}, renowned for excellence in engineering and technology education.`,
        NIT: `A National Institute of Technology in ${location}, offering high-quality technical education and strong industry connections.`,
        IIIT: `An Indian Institute of Information Technology in ${location}, specializing in computer science and information technology programs.`,
        IIM: `A top-ranked Indian Institute of Management in ${location}, known for producing India's leading business professionals.`,
        AIIMS: `A premier All India Institute of Medical Sciences in ${location}, offering world-class medical education and healthcare.`,
        BITS: `A top-ranked Birla Institute of Technology and Science campus in ${location}, known for its rigorous engineering programs.`,
        NLU: `A National Law University in ${location}, offering premier legal education and producing top judicial and corporate lawyers.`,
        University: `A well-established university in ${location}, offering a diverse range of undergraduate and postgraduate programs.`,
        Medical: `A reputable medical institution in ${location}, offering MBBS and postgraduate medical programs.`,
        Engineering: `A leading engineering institution in ${location}, providing technical education across multiple disciplines.`,
        Government: `A government-funded institution in ${location}, offering quality education at affordable fees.`,
        Private: `A private institution in ${location}, offering a wide range of professional and technical programs.`,
    };
    return typeDescriptions[type] || `An educational institution in ${location} offering quality academic programs.`;
}
function normalizeRow(row, rowIndex) {
    var _a, _b, _c, _d;
    const name = (_a = row.name) === null || _a === void 0 ? void 0 : _a.trim().replace(/^"|"$/g, '');
    if (!name) {
        console.warn(`  [SKIP] Row ${rowIndex}: missing name`);
        return null;
    }
    const state = (_b = row.state) === null || _b === void 0 ? void 0 : _b.trim();
    const city = (_c = row.city) === null || _c === void 0 ? void 0 : _c.trim();
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
    let placementPct = null;
    if (avgLpa !== null) {
        placementPct = Math.min(95, Math.round(40 + (avgLpa / 40) * 55));
    }
    // Rating: scale is already 1-10, clamp
    const rawRating = parseFloat(row.rating);
    const rating = !isNaN(rawRating) ? Math.min(10, Math.max(0, parseFloat(rawRating.toFixed(1)))) : null;
    // Courses by type
    const type = ((_d = row.type) === null || _d === void 0 ? void 0 : _d.trim()) || 'Private';
    const courses = COURSES_BY_TYPE[type] || COURSES_BY_TYPE['Private'];
    const description = generateDescription(name, type, city, state);
    return { name, location, description, established: null, fees, placements, placementPct, rating, courses };
}
// ─── Main Import ──────────────────────────────────────────────────────────────
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const csvPath = path.resolve(__dirname, '../src/data/india_colleges.csv');
        if (!fs.existsSync(csvPath)) {
            throw new Error(`CSV file not found at: ${csvPath}`);
        }
        console.log('📂 Reading CSV file...');
        const raw = fs.readFileSync(csvPath, 'utf-8');
        const rows = (0, sync_1.parse)(raw, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
            relax_quotes: true,
            relax_column_count: true,
        });
        console.log(`📊 Total rows in CSV: ${rows.length}`);
        // Normalize
        const records = [];
        const seen = new Set();
        let skipped = 0;
        rows.forEach((row, i) => {
            const record = normalizeRow(row, i + 2); // +2 for header + 1-index
            if (!record) {
                skipped++;
                return;
            }
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
        yield prisma.savedCollege.deleteMany({});
        yield prisma.college.deleteMany({});
        // Batch insert in chunks of 50 for performance
        const CHUNK_SIZE = 50;
        let inserted = 0;
        console.log('🚀 Inserting colleges into PostgreSQL...\n');
        for (let i = 0; i < records.length; i += CHUNK_SIZE) {
            const chunk = records.slice(i, i + CHUNK_SIZE);
            yield prisma.college.createMany({ data: chunk });
            inserted += chunk.length;
            process.stdout.write(`   Progress: ${inserted}/${records.length} colleges inserted\r`);
        }
        console.log(`\n\n✅ Import complete! ${inserted} colleges successfully imported.`);
    });
}
main()
    .then(() => prisma.$disconnect())
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error('\n❌ Import failed:', e.message);
    yield prisma.$disconnect();
}));
