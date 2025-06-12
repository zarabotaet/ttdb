# -*- coding: utf-8 -*-
import sqlite3

DB_FILE = 'blades.db'

def find_blades_with_kiri(db_path):
    """
    Подключается к базе данных SQLite и ищет основания,
    в составе которых есть 'kiri'.
    """
    try:
        conn = sqlite3.connect(db_path)
        # Позволяет обращаться к столбцам по их именам
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        # Запрос ищет 'kiri' в столбце 'Composition' без учета регистра.
        # Выбираем столбцы Name, Brand и Composition для вывода.
        # Убедитесь, что эти столбцы существуют в вашей таблице.
        query = """
        SELECT Name, Brand, Composition FROM blades
        WHERE Composition LIKE '%kiri%' COLLATE NOCASE;
        """

        cursor.execute(query)
        results = cursor.fetchall()

        if not results:
            print("Основания с использованием 'kiri' в составе не найдены.")
            return

        print("Найдены следующие основания с 'kiri' в составе:")
        print("-" * 60)
        for row in results:
            # Обращаемся к данным по именам столбцов
            print(f"  Название: {row['Name']}")
            print(f"  Бренд:    {row['Brand']}")
            print(f"  Состав:   {row['Composition']}\n")

    except sqlite3.Error as e:
        print(f"Ошибка при работе с базой данных: {e}")
        print("Убедитесь, что вы запустили основной скрипт парсинга, и он создал файл 'blades.db' с нужными столбцами ('Name', 'Brand', 'Composition').")
    finally:
        if conn:
            conn.close()

if __name__ == '__main__':
    find_blades_with_kiri(DB_FILE)
