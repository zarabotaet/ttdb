# -*- coding: utf-8 -*-
import requests
from bs4 import BeautifulSoup
import csv
import json # Импортируем модуль для работы с JSON
import sqlite3 # Импортируем модуль для работы с SQLite
from urllib.parse import urljoin
import re # Импортируем модуль для регулярных выражений

# Отключаем предупреждения о небезопасных запросах
from requests.packages.urllib3.exceptions import InsecureRequestWarning
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

# Определяем базовые URL-адреса
base_url = 'https://stervinou.net/ttbdb/'
brands_url = urljoin(base_url, 'brand.php')
blades_list_url = urljoin(base_url, 'liste.php')

brands_data = []
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

def sanitize_for_sql(name):
    """Очищает имя для использования в качестве имени столбца SQL."""
    # Заменяет пробелы и дефисы на подчеркивания
    name = re.sub(r'[\s-]', '_', name)
    # Удаляет все символы, кроме букв, цифр и подчеркиваний
    return re.sub(r'\W', '', name)

try:
    # --- ШАГ 1: Получение списка всех брендов ---
    print("Получение списка брендов...")
    response = requests.get(brands_url, verify=False, headers=headers)
    response.raise_for_status()
    soup = BeautifulSoup(response.content, 'html.parser')
    brand_select = soup.find('select', {'name': 'brand'})

    if brand_select:
        options = brand_select.find_all('option')
        for option in options:
            brand_value = option.get('value')
            brand_name = option.text.strip()
            if brand_value:
                brands_data.append({'name': brand_name, 'value': brand_value})
        print(f"Найдено {len(brands_data)} брендов.")
    else:
        print("Выпадающий список с брендами не найден на странице.")
        exit()

    # --- ШАГ 2: Парсинг данных и сохранение в файлы ---
    if brands_data:
        output_csv_filename = 'all_blades.csv'
        output_json_filename = 'all_blades.json'
        output_db_filename = 'blades.db'
        print(f"\n--- Начало парсинга, результаты будут сохранены в {output_csv_filename}, {output_json_filename} и {output_db_filename} ---")
        
        # --- Настройка базы данных SQLite ---
        conn = sqlite3.connect(output_db_filename)
        cursor = conn.cursor()
        
        all_data_for_json = []
        final_headers = []

        with open(output_csv_filename, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.writer(csvfile)
            headers_written = False

            for brand in brands_data:
                brand_name = brand['name']
                brand_value = brand['value']
                print(f"\n[+] Загрузка данных для бренда: '{brand_name}'")
                payload = {'brand': brand_value, 'find': 'brand'}

                try:
                    list_response = requests.post(blades_list_url, data=payload, verify=False, headers=headers)
                    list_response.raise_for_status()
                    list_soup = BeautifulSoup(list_response.content, 'html.parser')
                    results_table = list_soup.select_one('body > table:nth-child(2) > tr > td:nth-child(2) > table:nth-child(1)')

                    if results_table:
                        if not headers_written:
                            header_row = results_table.find('tr')
                            if header_row:
                                header_cells = header_row.find_all('td')
                                final_headers = [cell.text.strip() for cell in header_cells[2:16]]
                                writer.writerow(final_headers)
                                
                                # --- Создание таблицы в SQLite ---
                                sql_headers = [sanitize_for_sql(h) for h in final_headers]
                                columns_for_sql = ', '.join([f'"{h}" TEXT' for h in sql_headers])
                                cursor.execute(f'DROP TABLE IF EXISTS blades')
                                cursor.execute(f'CREATE TABLE blades (id INTEGER PRIMARY KEY AUTOINCREMENT, {columns_for_sql})')
                                conn.commit()
                                
                                headers_written = True

                        rows = results_table.find_all('tr')
                        for row in rows[1:]:
                            cols = row.find_all('td')
                            if len(cols) >= 16:
                                row_data = [cell.text.strip() for cell in cols[2:16]]
                                
                                # Запись в CSV
                                writer.writerow(row_data)
                                
                                # Подготовка данных для JSON
                                json_object = dict(zip(final_headers, row_data))
                                all_data_for_json.append(json_object)

                                # --- Запись данных в SQLite ---
                                placeholders = ', '.join(['?'] * len(sql_headers))
                                sql_insert_query = f'INSERT INTO blades ({", ".join(f"`{h}`" for h in sql_headers)}) VALUES ({placeholders})'
                                cursor.execute(sql_insert_query, row_data)

                                print(f"  - Найдено: {row_data[0]}") # Печатаем имя основания
                    else:
                        print(f"  - Таблица с основаниями не найдена для бренда '{brand_name}'.")
                        
                except requests.exceptions.RequestException as e:
                    print(f"  - Ошибка при запросе данных для бренда '{brand_name}': {e}")
        
        # --- ШАГ 3: Сохранение данных в JSON и закрытие соединений ---
        if all_data_for_json:
            print(f"\nСохранение данных в {output_json_filename}...")
            with open(output_json_filename, 'w', encoding='utf-8') as jsonfile:
                json.dump(all_data_for_json, jsonfile, ensure_ascii=False, indent=4)
            print("Сохранение в JSON завершено.")

        # Фиксируем изменения в базе данных и закрываем соединение
        conn.commit()
        conn.close()
        print("Данные сохранены в базу данных SQLite.")

        print(f"\n--- Парсинг полностью завершен ---")

except requests.exceptions.RequestException as e:
    print(f"Не удалось получить доступ к странице. Ошибка: {e}")
except Exception as e:
    print(f"Произошла непредвиденная ошибка: {e}")
