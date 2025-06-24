#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

/**
 * Converts a ply material string to a valid TypeScript enum key
 * @param {string} material - The material name
 * @returns {string} - Valid enum key
 */
function materialToEnumKey(material) {
  return material
    .toUpperCase()
    .replace(/[^\w\s]/g, "") // Remove special characters except spaces
    .replace(/\s+/g, "_") // Replace spaces with underscores
    .replace(/^(\d)/, "_$1"); // Prefix with underscore if starts with number
}

/**
 * Generates TypeScript enum from unique materials
 * @param {Set<string>} uniqueMaterials - Set of unique material names
 * @returns {string} - TypeScript enum code
 */
function generateEnum(uniqueMaterials) {
  // Sort materials alphabetically
  const sortedMaterials = Array.from(uniqueMaterials).sort();

  let enumCode = "export enum PlyMaterial {\n";
  const usedKeys = new Set();

  // Add all materials in alphabetical order
  sortedMaterials.forEach((material) => {
    let enumKey = materialToEnumKey(material);

    // Handle duplicate keys by adding a suffix
    let counter = 1;
    const originalKey = enumKey;
    while (usedKeys.has(enumKey)) {
      enumKey = `${originalKey}_${counter}`;
      counter++;
    }

    usedKeys.add(enumKey);
    enumCode += `  ${enumKey} = "${material}",\n`;
  });

  // Remove trailing comma from last entry
  enumCode = enumCode.replace(/,\n$/, "\n");
  enumCode += "}\n";

  return enumCode;
}

/**
 * Main function to process CSV and generate enum
 */
async function main() {
  try {
    const csvPath = path.join(__dirname, "../public/parsing/all_blades.csv");
    const outputPath = path.join(__dirname, "../src/generated/PlyMaterial.ts");

    console.log("Reading CSV file:", csvPath);

    if (!fs.existsSync(csvPath)) {
      console.error("CSV file not found:", csvPath);
      process.exit(1);
    }

    const uniqueMaterials = new Set();
    const plyColumns = [
      "Ply 1",
      "Ply 2",
      "Ply 3",
      "Ply 4",
      "Ply 5",
      "Ply 6",
      "Ply 7",
      "Ply 8",
      "Ply 9",
    ];

    return new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on("data", (row) => {
          // Extract all ply materials from the row
          plyColumns.forEach((column) => {
            const material = row[column];
            if (material && material.trim() !== "") {
              uniqueMaterials.add(material.trim());
            }
          });
        })
        .on("end", () => {
          console.log(`Found ${uniqueMaterials.size} unique materials:`);

          // Sort materials alphabetically for display
          const sortedMaterials = Array.from(uniqueMaterials).sort();
          sortedMaterials.forEach((material) => {
            console.log(`  - ${material}`);
          });

          // Generate TypeScript enum
          const enumCode = generateEnum(uniqueMaterials);

          // Ensure output directory exists
          const outputDir = path.dirname(outputPath);
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
          }

          // Write to file
          fs.writeFileSync(outputPath, enumCode);
          console.log(`\nGenerated enum written to: ${outputPath}`);

          // Also output to console for immediate use
          console.log("\n--- Generated PlyMaterial Enum ---");
          console.log(enumCode);

          resolve();
        })
        .on("error", (error) => {
          console.error("Error reading CSV:", error);
          reject(error);
        });
    });
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main, generateEnum, materialToEnumKey };
