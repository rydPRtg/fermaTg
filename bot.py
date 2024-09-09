import logging
from aiogram import Bot, Dispatcher, executor, types

API_TOKEN = '7308654023:AAF1hdW4f6VyeZnkn0kX946kIY6k7_xz9ZU'

# Настройка логирования
logging.basicConfig(level=logging.INFO)

# Инициализация бота
bot = Bot(token=API_TOKEN)
dp = Dispatcher(bot)

# Команда /start
@dp.message_handler(commands=['start'])
async def send_welcome(message: types.Message):
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
