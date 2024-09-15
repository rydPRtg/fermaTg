import logging
from aiogram import Bot, Dispatcher, types
from aiogram.utils import executor
from aiogram.types import InputFile

API_TOKEN = '7308654023:AAF1hdW4f6VyeZnkn0kX946kIY6k7_xz9ZU'

# Логирование
logging.basicConfig(level=logging.INFO)

# Инициализация бота
bot = Bot(token=API_TOKEN)
dp = Dispatcher(bot)


# Команда /start
@dp.message_handler(commands=['start'])
async def send_welcome(message: types.Message):
    # Путь к изображению
    photo_path = 'images/welcome.jpg'  # Убедитесь, что путь правильный и файл существует
    photo = InputFile(photo_path)

    # Отправляем картинку с сообщением
    await bot.send_photo(chat_id=message.chat.id, photo=photo,
                         caption="Привет! Добро пожаловать на ферму. Нажми на кнопку ниже, чтобы начать игру.",
                         reply_markup=game_button())


# Кнопка для запуска игры через WebApp
def game_button():
    markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
    web_app = types.WebAppInfo(url="https://rydprtg.github.io/fermaTg/game/index.html")
    game_button = types.KeyboardButton(text="Запустить игру", web_app=web_app)
    markup.add(game_button)
    return markup


# Обработка нажатий на другие кнопки (например, "Обработать", "Собрать урожай" и т.д.)
@dp.message_handler()
async def process_buttons(message: types.Message):
    if message.text == "Обработать":
        await message.reply("Вы выбрали: Обработать!")
    elif message.text == "Собрать урожай":
        await message.reply("Вы выбрали: Собрать урожай!")
    elif message.text == "Склад":
        await message.reply("Вы выбрали: Склад!")
    elif message.text == "Магазин":
        await message.reply("Вы выбрали: Магазин!")
    elif message.text == "Задание":
        await message.reply("Вы выбрали: Задание!")
    elif message.text == "Рейтинг":
        await message.reply("Вы выбрали: Рейтинг!")


# Запуск бота
if __name__ == '__main__':
    executor.start_polling(dp, skip_updates=True)
