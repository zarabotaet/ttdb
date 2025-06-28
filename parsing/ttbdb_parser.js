const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

// Отключаем предупреждения о сертификатах SSL
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const baseUrl = "https://stervinou.net/ttbdb/";
const brandsUrl = new URL("brand.php", baseUrl).href;
const bladesListUrl = new URL("liste.php", baseUrl).href;

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
};

async function parseBrands() {
  try {
    console.log("Получение списка брендов...");
    const response = await axios.get(brandsUrl, { headers });
    const $ = cheerio.load(response.data);

    const brandsData = [];
    const brandSelect = $('select[name="brand"]');

    if (brandSelect.length) {
      brandSelect.find("option").each((index, option) => {
        const brandValue = $(option).attr("value");
        const brandName = $(option).text().trim();
        if (brandValue) {
          brandsData.push({ name: brandName, value: brandValue });
        }
      });
      console.log(`Найдено ${brandsData.length} брендов.`);
    } else {
      console.log("Выпадающий список с брендами не найден на странице.");
      process.exit(1);
    }

    return brandsData;
  } catch (error) {
    console.error(
      "Не удалось получить доступ к странице. Ошибка:",
      error.message
    );
    throw error;
  }
}

async function parseBlades(brandsData) {
  const outputCsvFilename = path.join("stervinou", "all_blades.csv");
  console.log(
    `\n--- Начало парсинга, результаты будут сохранены в ${outputCsvFilename} ---`
  );

  let csvContent = "";
  let headersWritten = false;
  let finalHeaders = [];

  for (const brand of brandsData) {
    const brandName = brand.name;
    const brandValue = brand.value;
    const payload = new URLSearchParams({
      brand: brandValue,
      find: "brand",
    });

    try {
      const listResponse = await axios.post(bladesListUrl, payload, {
        headers,
      });
      const $ = cheerio.load(listResponse.data);

      // Используем CSS селектор для 3-й таблицы (индекс 2)
      const tables = $("table");
      let resultsTable = null;

      // Ищем таблицу с нужной структурой
      tables.each((index, table) => {
        const firstRow = $(table).find("tr").first();
        const cells = firstRow.find("td");
        if (cells.length >= 16) {
          const brandCell = $(cells[2]).text().trim();
          if (brandCell === "Brand") {
            resultsTable = $(table);
            return false; // break
          }
        }
      });

      if (resultsTable) {
        if (!headersWritten) {
          const headerRow = resultsTable.find("tr").first();
          if (headerRow.length) {
            const headerCells = headerRow.find("td");
            // Берем колонки с 2 по 15 (индексы от 2 до 15 включительно)
            for (let i = 2; i < 16 && i < headerCells.length; i++) {
              finalHeaders.push($(headerCells[i]).text().trim());
            }
            csvContent += finalHeaders.join(",") + "\n";
            headersWritten = true;
          }
        }

        const rows = resultsTable.find("tr");
        rows.each((index, row) => {
          if (index === 0) return; // Пропускаем заголовок

          const cols = $(row).find("td");
          if (cols.length >= 16) {
            const rowData = [];
            // Берем колонки с 2 по 15 (индексы от 2 до 15 включительно)
            for (let i = 2; i < 16; i++) {
              const cellText = $(cols[i]).text().trim();
              // Экранируем кавычки и оборачиваем в кавычки если содержит запятую
              if (cellText.includes(",") || cellText.includes('"')) {
                rowData.push(`"${cellText.replace(/"/g, '""')}"`);
              } else {
                rowData.push(cellText);
              }
            }
            csvContent += rowData.join(",") + "\n";
          }
        });
      } else {
        console.log(
          `  - Таблица с основаниями не найдена для бренда '${brandName}'.`
        );
      }
    } catch (error) {
      console.log(
        `  - Ошибка при запросе данных для бренда '${brandName}': ${error.message}`
      );
    }
  }

  // Записываем в файл
  fs.writeFileSync(outputCsvFilename, csvContent, "utf8");
  console.log(`\n--- Парсинг полностью завершен ---`);

  return outputCsvFilename;
}

async function main() {
  try {
    const brandsData = await parseBrands();

    if (brandsData.length > 0) {
      const outputFile = await parseBlades(brandsData);
      console.log(`Данные сохранены в файл: ${outputFile}`);
    }
  } catch (error) {
    console.error("Произошла непредвиденная ошибка:", error.message);
  }
}

// Запускаем парсер
main();
