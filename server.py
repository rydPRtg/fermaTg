from flask import Flask, request, jsonify
import psycopg2
import redis

app = Flask(__name__)

# Соединение с PostgreSQL
conn = psycopg2.connect(
    dbname='ваша_база_данных',
    user='ваш_пользователь',
    password='ваш_пароль',
    host='localhost',
    port='5432'
)
cursor = conn.cursor()

# Соединение с Redis
redis_client = redis.StrictRedis(host='localhost', port=6379, db=0)

# Обновление монет в базе данных
@app.route('/update_coins', methods=['POST'])
def update_coins():
    data = request.get_json()
    user_id = request.headers.get('X-User-ID')  # Получаем ID пользователя из заголовка
    coins = data['coins']

    # Обновляем в PostgreSQL
    cursor.execute("UPDATE users SET coins = %s WHERE user_id = %s", (coins, user_id))
    conn.commit()

    # Обновляем в Redis
    redis_client.set(f"user:{user_id}:coins", coins)
    return jsonify({"status": "ok"})

# Обновление состояния квадратов
@app.route('/update_squares', methods=['POST'])
def update_squares():
    data = request.get_json()
    user_id = request.headers.get('X-User-ID')  # Получаем ID пользователя из заголовка
    squares = data['squares']

    # Обновляем в Redis состояние квадратов
    redis_client.set(f"user:{user_id}:squares", squares)
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
