# Enum Generation Scripts

This directory contains scripts to automatically generate TypeScript enums from the CSV data.

## Scripts

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

### Generate Both

To generate both enums at once:

```bash
npm run generate-enums
```

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
