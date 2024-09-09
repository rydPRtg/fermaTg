import logging
from aiogram import Bot, Dispatcher, executor, types

API_TOKEN = '7537553156:AAHsZxtEM8PtbA1WUVJxPQO5PmTEwEbDQEI'

# Настройка логирования
logging.basicConfig(level=logging.INFO)

# Инициализация бота
bot = Bot(token=API_TOKEN)
dp = Dispatcher(bot)

# Команда /start
@dp.message_handler(commands=['start'])
async def send_welcome(message: types.Message):
    await message.reply("Привет! Нажми на кнопку, чтобы сыграть в игру.", reply_markup=game_button())

# Кнопка для запуска игры
def game_button():
    markup = types.InlineKeyboardMarkup()
    game_button = types.InlineKeyboardButton("Запустить игру", url="https://ваш-домен.com/game/index.html")
    markup.add(game_button)
    return markup

# Запуск бота
if __name__ == '__main__':
    executor.start_polling(dp, skip_updates=True)
