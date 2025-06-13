# -*- coding: utf-8 -*-
import requests
from bs4 import BeautifulSoup
import csv
from urllib.parse import urljoin

from requests.packages.urllib3.exceptions import InsecureRequestWarning
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

base_url = 'https://stervinou.net/ttbdb/'
brands_url = urljoin(base_url, 'brand.php')
blades_list_url = urljoin(base_url, 'liste.php')

brands_data = []
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

try:
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

    if brands_data:
        output_csv_filename = 'all_blades.csv'
        print(f"\n--- Начало парсинга, результаты будут сохранены в {output_csv_filename} ---")

        with open(output_csv_filename, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.writer(csvfile)
            headers_written = False
            final_headers = []

            for brand in brands_data:
                brand_name = brand['name']
                brand_value = brand['value']
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
                                headers_written = True

                        rows = results_table.find_all('tr')
                        for row in rows[1:]:
                            cols = row.find_all('td')
                            if len(cols) >= 16:
                                row_data = [cell.text.strip() for cell in cols[2:16]]
                                writer.writerow(row_data)
                    else:
                        print(f"  - Таблица с основаниями не найдена для бренда '{brand_name}'.")
                except requests.exceptions.RequestException as e:
                    print(f"  - Ошибка при запросе данных для бренда '{brand_name}': {e}")

        print(f"\n--- Парсинг полностью завершен ---")

except requests.exceptions.RequestException as e:
    print(f"Не удалось получить доступ к странице. Ошибка: {e}")
except Exception as e:
    print(f"Произошла непредвиденная ошибка: {e}")
