# Data Processing Scripts

This directory contains scripts to process CSV data and generate TypeScript enums.

## Scripts

### csv-to-json.js

Converts the raw CSV data to JSON format for frontend consumption.

**Usage:**

```bash
npm run csv-to-json
```

**Input:** `raw_data/all_blades.csv`
**Output:** `public/all_blades.json`

### generate-ply-enum.js

Generates the `PlyMaterial` enum from all unique ply materials found in the CSV.

**Usage:**

```bash
npm run generate-ply-enum
```

**Output:** `src/generated/PlyMaterial.ts`

### generate-brand-enum.js

Generates the `Brand` enum from all unique brands found in the CSV.

**Usage:**

```bash
npm run generate-brand-enum
```

**Output:** `src/generated/Brand.ts`

### Generate All Data

To generate JSON and both enums at once:

```bash
npm run prepare-data
```

This will run:

1. `csv-to-json` - Convert CSV to JSON
2. `generate-enums` - Generate both Brand and PlyMaterial enums

## Features

- **Automatic generation**: Extracts unique values directly from CSV data
- **Valid TypeScript identifiers**: Converts names to valid enum keys
- **Duplicate handling**: Automatically handles duplicate keys with numeric suffixes
- **Alphabetical sorting**: Results are sorted alphabetically for consistency
- **Original value preservation**: String values maintain exact original names

## Integration

The generated enums are imported and re-exported in `src/types.ts`:

```typescript
import { PlyMaterial } from "./generated/PlyMaterial";
import { Brand } from "./generated/Brand";

export { Brand, PlyMaterial };
```

This allows the rest of the project to import them as:

```typescript
import { Brand, PlyMaterial } from "./types";
```

## Workflow

1. Update CSV data (`public/parsing/all_blades.csv`)
2. Run `npm run generate-enums`
3. Generated enums are automatically used throughout the project
4. No manual enum maintenance required
