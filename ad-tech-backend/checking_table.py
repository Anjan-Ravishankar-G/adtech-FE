import pymysql

try:
    # Establish the MySQL connection
    connection = pymysql.connect(
        host="mysql-amazon-ads-amazon-ads-1.d.aivencloud.com",
        port=23839,
        user="avnadmin",
        password="AVNS_hraI9v9t0XAbisIIrCG",
        database="defaultdb",
        cursorclass=pymysql.cursors.DictCursor
    )

    if connection.open:
        print("Connection established successfully!")
        
        # Create a cursor object
        cursor = connection.cursor()
        
        # Check existing tables in the database
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        
        print("Existing tables in the database:")
        table_names = []
        for table in tables:
            table_name = table["Tables_in_defaultdb"]
            table_names.append(table_name)
            print(table_name)
        
        # Retrieve rows from each table
        for table in table_names:
            cursor.execute(f"SELECT * FROM {table} ")
            rows = cursor.fetchall()
            print(f"\nSample rows from {table}:")
            for row in rows:
                print(row)
        
except pymysql.MySQLError as e:
    print(f"Error: {e}")

finally:
    if connection.open:
        cursor.close()
        connection.close()
        print("MySQL connection closed.")
