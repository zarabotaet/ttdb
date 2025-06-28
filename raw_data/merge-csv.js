const fs = require("fs");
const path = require("path");

/**
 * Парсит CSV файл и возвращает массив объектов
 * @param {string} filePath - путь к CSV файлу
 * @returns {Array} массив объектов с данными
 */
function parseCSV(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`Файл ${filePath} не найден, пропускаем...`);
    return [];
  }

  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.trim().split("\n");

  if (lines.length <= 1) {
    console.log(`Файл ${filePath} пустой или содержит только заголовки`);
    return [];
  }

  const headers = lines[0].split(",");
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",");
    if (values.length >= 2 && values[0] && values[1]) {
      // Проверяем, что есть Brand и Model
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || "";
      });
      data.push(row);
    }
  }

  return data;
}

/**
 * Конвертирует массив объектов в CSV строку
 * @param {Array} data - массив объектов
 * @param {Array} headers - заголовки колонок
 * @returns {string} CSV строка
 */
function arrayToCSV(data, headers) {
  const csvLines = [headers.join(",")];

  data.forEach((row) => {
    const values = headers.map((header) => row[header] || "");
    csvLines.push(values.join(","));
  });

  return csvLines.join("\n");
}

/**
 * Создает уникальный ключ для основания (Brand + Model)
 * @param {Object} blade - объект с данными основания
 * @returns {string} уникальный ключ
 */
function getBladeKey(blade) {
  return `${blade.Brand}|${blade.Model}`;
}

/**
 * Объединяет данные из двух CSV файлов
 */
function mergeCSVFiles() {
  const stervinouFile = path.join(__dirname, "all_blades_stervinou.csv");
  const manualFile = path.join(__dirname, "manual_blades.csv");
  const outputFile = path.join(__dirname, "all_blades.csv");

  console.log("🔄 Начинаем объединение CSV файлов...");
  console.log(`📁 Источник 1: ${stervinouFile}`);
  console.log(`📁 Источник 2: ${manualFile}`);
  console.log(`📁 Результат: ${outputFile}`);

  // Парсим оба файла
  const stervinouData = parseCSV(stervinouFile);
  const manualData = parseCSV(manualFile);

  console.log(`📊 Данные из stervinou: ${stervinouData.length} записей`);
  console.log(`📊 Ручные данные: ${manualData.length} записей`);

  // Определяем заголовки (используем из первого файла, который содержит данные)
  const headers =
    stervinouData.length > 0
      ? Object.keys(stervinouData[0])
      : manualData.length > 0
      ? Object.keys(manualData[0])
      : [
          "Brand",
          "Model",
          "Nb plies",
          "Weight (g)",
          "Thick. (mm)",
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

  // Создаем Map для уникальных оснований
  const bladesMap = new Map();
  let addedCount = 0;
  let overriddenCount = 0;

  // Сначала добавляем данные из stervinou
  stervinouData.forEach((blade) => {
    const key = getBladeKey(blade);
    bladesMap.set(key, { ...blade, source: "stervinou" });
    addedCount++;
  });

  // Затем добавляем/перезаписываем ручными данными (приоритет выше)
  manualData.forEach((blade) => {
    const key = getBladeKey(blade);
    if (bladesMap.has(key)) {
      console.log(`🔄 Перезаписываем: ${blade.Brand} ${blade.Model}`);
      overriddenCount++;
    } else {
      console.log(`➕ Добавляем новое: ${blade.Brand} ${blade.Model}`);
      addedCount++;
    }
    bladesMap.set(key, { ...blade, source: "manual" });
  });

  // Конвертируем обратно в массив и удаляем служебное поле source
  const mergedData = Array.from(bladesMap.values()).map((blade) => {
    const { source, ...cleanBlade } = blade;
    return cleanBlade;
  });

  // Сортируем по бренду, затем по модели
  mergedData.sort((a, b) => {
    if (a.Brand !== b.Brand) {
      return a.Brand.localeCompare(b.Brand);
    }
    return a.Model.localeCompare(b.Model);
  });

  // Записываем результат
  const csvContent = arrayToCSV(mergedData, headers);
  fs.writeFileSync(outputFile, csvContent, "utf8");

  console.log("\n✅ Объединение завершено!");
  console.log(`📊 Итого записей: ${mergedData.length}`);
  console.log(`🔄 Перезаписано: ${overriddenCount}`);
  console.log(`💾 Файл сохранен: ${outputFile}`);

  // Копируем результат в папку public/parsing для использования приложением
  const publicOutputFile = path.join(
    __dirname,
    "../public/parsing/all_blades.csv"
  );
  const publicDir = path.dirname(publicOutputFile);

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.copyFileSync(outputFile, publicOutputFile);
  console.log(`📁 Скопировано в: ${publicOutputFile}`);

  return outputFile;
}

// Запускаем если файл вызывается напрямую
if (require.main === module) {
  try {
    mergeCSVFiles();
  } catch (error) {
    console.error("❌ Ошибка при объединении файлов:", error.message);
    process.exit(1);
  }
}

module.exports = { mergeCSVFiles };
