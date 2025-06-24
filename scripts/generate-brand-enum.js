#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

/**
 * Converts a brand string to a valid TypeScript enum key
 * @param {string} brand - The brand name
 * @returns {string} - Valid enum key
 */
function brandToEnumKey(brand) {
  return brand
    .toUpperCase()
    .replace(/[^\w\s]/g, "") // Remove special characters except spaces
    .replace(/\s+/g, "_") // Replace spaces with underscores
    .replace(/^(\d)/, "_$1"); // Prefix with underscore if starts with number
}

/**
 * Generates TypeScript enum from unique brands
 * @param {Set<string>} uniqueBrands - Set of unique brand names
 * @returns {string} - TypeScript enum code
 */
function generateEnum(uniqueBrands) {
  // Sort brands alphabetically
  const sortedBrands = Array.from(uniqueBrands).sort();

  let enumCode = "export enum Brand {\n";
  const usedKeys = new Set();

  // Add all brands in alphabetical order
  sortedBrands.forEach((brand) => {
    let enumKey = brandToEnumKey(brand);

    // Handle duplicate keys by adding a suffix
    let counter = 1;
    const originalKey = enumKey;
    while (usedKeys.has(enumKey)) {
      enumKey = `${originalKey}_${counter}`;
      counter++;
    }

    usedKeys.add(enumKey);
    enumCode += `  ${enumKey} = "${brand}",\n`;
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
    const outputPath = path.join(__dirname, "../src/generated/Brand.ts");

    console.log("Reading CSV file:", csvPath);

    if (!fs.existsSync(csvPath)) {
      console.error("CSV file not found:", csvPath);
      process.exit(1);
    }

    const uniqueBrands = new Set();

    return new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on("data", (row) => {
          // Extract brand from the row
          const brand = row["Brand"];
          if (brand && brand.trim() !== "") {
            uniqueBrands.add(brand.trim());
          }
        })
        .on("end", () => {
          console.log(`Found ${uniqueBrands.size} unique brands:`);

          // Sort brands alphabetically for display
          const sortedBrands = Array.from(uniqueBrands).sort();
          sortedBrands.forEach((brand) => {
            console.log(`  - ${brand}`);
          });

          // Generate TypeScript enum
          const enumCode = generateEnum(uniqueBrands);

          // Ensure output directory exists
          const outputDir = path.dirname(outputPath);
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
          }

          // Write to file
          fs.writeFileSync(outputPath, enumCode);
          console.log(`\nGenerated enum written to: ${outputPath}`);

          // Also output to console for immediate use
          console.log("\n--- Generated Brand Enum ---");
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

module.exports = { main, generateEnum, brandToEnumKey };
