#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

/**
 * Converts CSV data to JSON format for the frontend
 */
async function convertCsvToJson() {
  try {
    const csvPath = path.join(__dirname, "../raw_data/all_blades.csv");
    const outputPath = path.join(__dirname, "../public/all_blades.json");

    console.log("Reading CSV file:", csvPath);

    if (!fs.existsSync(csvPath)) {
      console.error("CSV file not found:", csvPath);
      process.exit(1);
    }

    const blades = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on("data", (row) => {
          // Filter out empty rows
          if (!row.Brand || !row.Model) {
            return;
          }

          // Convert to the format expected by the frontend
          const blade = {
            brand: row.Brand.trim(),
            model: row.Model.trim(),
            pliesNumber: parseInt(row["Nb plies"], 10) || 0,
            weight: parseFloat(row["Weight (g)"]) || 0,
            thick: parseFloat(row["Thick. (mm)"]) || 0,
            plies: [
              row["Ply 1"],
              row["Ply 2"],
              row["Ply 3"],
              row["Ply 4"],
              row["Ply 5"],
              row["Ply 6"],
              row["Ply 7"],
              row["Ply 8"],
              row["Ply 9"],
            ]
              .filter((ply) => ply && ply.trim() !== "")
              .map((ply) => ply.trim()),
          };

          blades.push(blade);
        })
        .on("end", () => {
          console.log(`Converted ${blades.length} blades from CSV to JSON`);

          // Ensure output directory exists
          const outputDir = path.dirname(outputPath);
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
          }

          // Write JSON file
          const jsonData = JSON.stringify(blades, null, 2);
          fs.writeFileSync(outputPath, jsonData);

          console.log(`JSON file written to: ${outputPath}`);
          console.log(`File size: ${(jsonData.length / 1024).toFixed(2)} KB`);

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
  convertCsvToJson().catch(console.error);
}

module.exports = { convertCsvToJson };
