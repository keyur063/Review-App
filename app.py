from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)

# Initialize the database
def init_db():
    conn = sqlite3.connect('reviews.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS reviews
                 (id INTEGER PRIMARY KEY, content TEXT)''')
    conn.commit()
    conn.close()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/reviews', methods=['GET', 'POST', 'PUT', 'DELETE'])
def manage_reviews():
    conn = sqlite3.connect('reviews.db')
    c = conn.cursor()

    if request.method == 'POST':
        content = request.json['content']
        c.execute('INSERT INTO reviews (content) VALUES (?)', (content,))
        conn.commit()
        return jsonify({'id': c.lastrowid, 'content': content})

    elif request.method == 'GET':
        c.execute('SELECT * FROM reviews')
        reviews = [{'id': row[0], 'content': row[1]} for row in c.fetchall()]
        return jsonify(reviews)

    elif request.method == 'PUT':
        review_id = request.json['id']
        content = request.json['content']
        c.execute('UPDATE reviews SET content = ? WHERE id = ?', (content, review_id))
        conn.commit()
        return jsonify({'id': review_id, 'content': content})

    elif request.method == 'DELETE':
        review_id = request.json['id']
        c.execute('DELETE FROM reviews WHERE id = ?', (review_id,))
        conn.commit()
        return jsonify({'id': review_id})

    conn.close()

if __name__ == '__main__':
    init_db()
    app.run(debug=True)

