import logging
import psycopg2
import redis
from aiogram import Bot, Dispatcher, executor, types

API_TOKEN = '7308654023:AAF1hdW4f6VyeZnkn0kX946kIY6k7_xz9ZU'

# Настройка логирования
logging.basicConfig(level=logging.INFO)

# Инициализация бота
bot = Bot(token=API_TOKEN)
dp = Dispatcher(bot)

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


# Команда /start
@dp.message_handler(commands=['start'])
async def send_welcome(message: types.Message):
    user_id = message.from_user.id

    # Проверяем, есть ли пользователь в базе данных PostgreSQL
    cursor.execute("SELECT coins FROM users WHERE user_id = %s", (user_id,))
    result = cursor.fetchone()

    if result is None:
        # Если пользователь не существует, создаем запись с 0 монет
        cursor.execute("INSERT INTO users (user_id, coins) VALUES (%s, %s)", (user_id, 0))
        conn.commit()
        coins = 0
    else:
        coins = result[0]

    # Сохраняем данные пользователя в Redis (статус квадратов и монеты)
    redis_client.set(f"user:{user_id}:coins", coins)
    redis_client.set(f"user:{user_id}:squares", "0000")  # Статус всех квадратов (4 квадрата, все выключены)

    await message.reply("Нажми на кнопку ниже, чтобы запустить игру!", reply_markup=game_button())


# Кнопка для запуска игры через WebApp
def game_button():
    markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
    web_app = types.WebAppInfo(url="https://rydprtg.github.io/fermaTg/game/index.html")
    game_button = types.KeyboardButton(text="Запустить игру", web_app=web_app)
    markup.add(game_button)
    return markup


# Запуск бота
if __name__ == '__main__':
    executor.start_polling(dp, skip_updates=True)
