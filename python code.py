# Flask Application for Expense and Revenue Management System

from flask import Flask, request, jsonify, render_template
import sqlite3

app = Flask(__name__)
DATABASE = 'finance.db'

# Database initialization
def init_db():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS finance_records (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        category TEXT NOT NULL,
                        amount REAL NOT NULL,
                        record_date TEXT NOT NULL,
                        record_type TEXT NOT NULL CHECK (record_type IN ('Expense', 'Revenue')),
                        description TEXT
                      )''')
    conn.commit()
    conn.close()

# Routes
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/records', methods=['GET'])
def get_records():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM finance_records")
    records = cursor.fetchall()
    conn.close()
    return jsonify(records)

@app.route('/record', methods=['POST'])
def add_record():
    data = request.json
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''INSERT INTO finance_records (category, amount, record_date, record_type, description)
                      VALUES (?, ?, ?, ?, ?)''',
                   (data['category'], data['amount'], data['record_date'], data['record_type'], data['description']))
    conn.commit()
    conn.close()
    return jsonify({"message": "Record added successfully"}), 201

@app.route('/record/<int:record_id>', methods=['PUT'])
def update_record(record_id):
    data = request.json
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''UPDATE finance_records SET category = ?, amount = ?, record_date = ?, 
                      record_type = ?, description = ? WHERE id = ?''',
                   (data['category'], data['amount'], data['record_date'], data['record_type'], data['description'], record_id))
    conn.commit()
    conn.close()
    return jsonify({"message": "Record updated successfully"})

@app.route('/record/<int:record_id>', methods=['DELETE'])
def delete_record(record_id):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM finance_records WHERE id = ?", (record_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Record deleted successfully"})

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
