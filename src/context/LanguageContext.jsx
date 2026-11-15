import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const LanguageContext = createContext(null);

const translations = {
  'Головна': 'Home', 'Каталог': 'Catalog', 'Пошук фільму...': 'Search movies...',
  'Випадковий фільм': 'Random movie', 'Увійти': 'Sign in', 'Вийти': 'Sign out',
  'Популярне в каталозі': 'Popular in the catalog', 'Стрічки з найвищими оцінками глядачів': 'Top-rated movies by viewers',
  'Увесь каталог': 'Browse all movies', 'фільтри під настрій': 'mood-based discovery',
  'Скинути Vibecheck': 'Clear Vibecheck', 'Знайдено:': 'Found:', 'Результати Vibecheck для': 'Vibecheck results for',
  'Під цей Vibecheck поки немає відповідних фільмів у каталозі.': 'No movies in the catalog match this Vibecheck yet.',
  'Каталог та фільтри': 'Catalog & filters', 'Знайдено': 'Found', 'Скинути все': 'Reset all',
  'Жанр': 'Genre', 'Усі жанри': 'All genres', 'Фантастика': 'Sci-Fi', 'Драма': 'Drama', 'Трилер': 'Thriller', 'Кримінал': 'Crime', 'Екшн': 'Action', 'Біографія': 'Biography', 'Мелодрама': 'Romance', 'Музика': 'Music',
  'Рік випуску': 'Release year', 'Усі роки': 'All years', 'Класика (до 2000)': 'Classics (pre-2000)',
  'Мін. Рейтинг IMDb': 'Min. IMDb rating', 'Будь-який': 'Any', 'Сортувати за': 'Sort by', 'За замовчуванням': 'Default', 'Рейтингом (спочатку вищий)': 'Rating (highest first)', 'Роком (спочатку новіші)': 'Year (newest first)', 'Роком (спочатку старіші)': 'Year (oldest first)', 'Назвою (А-Я)': 'Title (A–Z)',
  'Нічого не знайдено': 'No movies found', 'Спробуйте змінити або скинути вибрані фільтри.': 'Try changing or resetting your filters.', 'Скинути фільтри': 'Reset filters',
  'Трейлер': 'Trailer', 'Детальніше': 'View details', 'У списку перегляду': 'In watchlist', 'Додати до списку перегляду': 'Add to watchlist',
  'Категорія або вайб:': 'Genre or mood:', 'Тривалість фільму:': 'Movie runtime:', 'Запустити Movie Hunter': 'Start Movie Hunter', 'Перекрутити': 'Pick another', 'Перейти': 'View movie',
  'Підберемо фільм для перегляду': 'Find your next movie', 'Залиште всі вайби або звузьте пошук до свого настрою.': 'Keep all moods selected or narrow the search to match yours.', 'Немає фільмів за такими параметрами': 'No movies match these filters', 'Спробуйте розширити вибір тривалості або вайбів.': 'Try widening the runtime or mood filters.',
  'Улюблене': 'Favorites', 'У збережених': 'Watchlist', 'Додати до мого списку': 'Add to my list', 'Мої добірки:': 'My collections:', 'Спочатку створіть список у Профілі.': 'Create a list in your profile first.', 'У головних ролях:': 'Starring:',
  'Рецензії та обговорення': 'Reviews & discussion', 'Усього:': 'Total:', 'Залишити свій відгук як': 'Write a review as', 'Оцінка:': 'Rating:', 'Поділіться вашими враженнями від перегляду...': 'Share your thoughts about the movie...', 'Повторний перегляд (Rewatch)': 'Rewatch', 'Опубліковано!': 'Published!', 'Надіслати': 'Submit', 'Бажаєте залишити рецензію?': 'Want to leave a review?', 'Увійдіть у свій акаунт, щоб мати можливість оцінювати фільми та писати коментарі.': 'Sign in to rate movies and write reviews.', 'Поки немає жодної рецензії. Будьте першим, хто залишить відгук!': 'No reviews yet. Be the first to write one!',
  'Увійти в Plota': 'Sign in to Plota', 'Реєстрація в Plota': 'Create a Plota account', 'Вхід в акаунт': 'Sign in', 'Створіть свій унікальний профіль для оцінок та рецензій': 'Create your profile to rate movies and write reviews', 'Увійдіть за допомогою нікнейму або електронної пошти': 'Sign in with your username or email', 'Нікнейм (унікальний)': 'Username (unique)', 'Нікнейм або Email': 'Username or email', 'наприклад: movie_geek': 'e.g. movie_geek', 'Введіть нікнейм або пошту...': 'Enter your username or email...', 'Введіть пароль...': 'Enter your password...', 'Пароль': 'Password', 'Зареєструватися': 'Create account', 'Вже є акаунт? Увійти': 'Already have an account? Sign in', 'Немає акаунта? Зареєструватися': 'New here? Create an account', 'Скасувати': 'Cancel',
  '2020-ті (2020+)': '2020s (2020+)', '2010-ті (2010–2019)': '2010s (2010–2019)', '2000-ні (2000–2009)': '2000s (2000–2009)',
  '< 90 хв': '< 90 min', '90 – 120 хв': '90–120 min', '120+ хв': '120+ min', 'Будь-яка': 'Any runtime',
  'Будь ласка, заповніть усі поля': 'Please fill in all fields', 'Нікнейм має містити щонайменше 3 символи': 'Username must be at least 3 characters', 'Цей нікнейм уже зайнятий. Оберіть інший!': 'That username is taken. Choose another one.', 'Користувач із такою поштою вже існує': 'An account with this email already exists', 'Введіть нікнейм/email та пароль': 'Enter your username/email and password', 'Користувача з таким нікнеймом або email не знайдено': 'No user found with that username or email', 'Невірний пароль': 'Incorrect password',
  'Назад до каталогу': 'Back to catalog', 'Назад до профілю': 'Back to profile', 'Назад на головну': 'Back to home',
  'Улюблені ({favoriteMedia.length})': 'Favorites ({favoriteMedia.length})',
  'усі вайби': 'All moods',
  'Movie Hunter — Пошук наосліп': 'Movie Hunter — Blind pick', 'Закрити Movie Hunter': 'Close Movie Hunter', 'фільмів': 'movies',
  'Усі вайби': 'All moods', 'Переглянути каталог': 'Browse catalog', 'Оцініть переглянутий фільм і поділіться враженнями на його сторінці.': 'Rate a movie you have watched and share your thoughts on its page.', 'Переключити тему': 'Toggle theme', 'Змінити мову на українську': 'Switch language to Ukrainian', 'Вийти': 'Sign out', 'Видалити свій відгук': 'Delete your review', 'Список улюбленого поки порожній': 'Your favorites list is empty', 'Список перегляду порожній': 'Your watchlist is empty', 'Рецензій поки немає': 'No reviews yet',
  'Постер фільму': 'Movie poster', 'Слайд': 'Slide', 'із': 'of', 'Показати слайд': 'Show slide', 'Попередній фільм': 'Previous movie', 'Наступний фільм': 'Next movie', 'Трейлер:': 'Trailer:', 'Закрити трейлер': 'Close trailer', 'У списку': 'In watchlist', 'У список': 'Add to watchlist',
  'Вибір редакції': "Editor's pick", 'Класика фантастики': 'Sci-fi classic', 'Прем’єра сезону': 'Season premiere', 'Morally Grey / Нуар': 'Morally Grey / Noir', 'Found Family / Пригоди': 'Found Family / Adventure',
  'Список улюбленого поки порожній': 'Your favorites list is empty', 'Зберігайте фільми, до яких хочете повернутися, і вони з’являться тут.': 'Save movies you want to revisit and they will appear here.', 'Знайти фільми': 'Find movies', 'Список перегляду порожній': 'Your watchlist is empty', 'Додавайте сюди фільми, які плануєте подивитися найближчим часом.': 'Add movies you plan to watch soon.', 'Обрати фільм': 'Browse movies', 'Рецензій поки немає': 'No reviews yet', 'Персональні добірки': 'Custom collections', 'Створити список': 'Create a list',
  'Видалити відгук': 'Delete review', 'Показати ще': 'Show more', 'Ваші тематичні листи та колекції:': 'Your themed lists and collections:', 'Немає персональних списків': 'No custom lists yet', 'Натисніть кнопку вище, щоб створити добірку (наприклад: "Топ 5 нуару").': 'Use the button above to create a collection (for example, “Top 5 noir films”).', 'У цьому списку поки немає фільмів. Додавайте їх зі сторінки будь-якого фільму!': 'This list is empty. Add movies from any movie page!', 'Видалити список': 'Delete list', 'Прибрати зі списку': 'Remove from list', 'Створити новий список': 'Create a new list', 'Назва списку *': 'List name *', 'наприклад: Топ атмосферного нуару': 'e.g. Atmospheric noir favorites', 'Опис (необов\'язково)': 'Description (optional)', 'Короткий опис добірки...': 'A short description of this collection...', 'Створити': 'Create',
  'У Plota з Жовтня 2026': 'On Plota since October 2026', 'ГОДИН ПЕРЕГЛЯДУ': 'HOURS WATCHED', 'РЕЦЕНЗІЙ': 'REVIEWS', 'У ЗБЕРЕЖЕНИХ': 'IN WATCHLIST', 'В УЛЮБЛЕНИХ': 'FAVORITES', 'Управління даними акаунта (JSON):': 'Account data (JSON):', 'Експортувати JSON': 'Export JSON', 'Імпортувати JSON': 'Import JSON', 'Мої рецензії': 'My reviews',
  'Оцініть переглянутий фільм і поділіться враженнями на його сторінці.': 'Rate a movie you have watched and share your thoughts on its page.', 'Переглянути каталог': 'Browse catalog', 'Список улюбленого поки порожній': 'Your favorites list is empty', 'Список перегляду порожній': 'Your watchlist is empty', 'Рецензій поки немає': 'No reviews yet', 'Повторний перегляд': 'Rewatch', 'Показати ще': 'Show more',
  'Дані успішно імпортовано!': 'Data imported successfully!', 'Помилка читання файлу JSON': 'Could not read the JSON file',
  'Резервна копія та дані акаунта': 'Backup & account data', 'Збережіть свої списки та вподобання або перенесіть їх з іншого пристрою.': 'Save your lists and favorites, or transfer them from another device.', 'Експортувати дані': 'Export data', 'Імпортувати дані': 'Import data',
  'Пригоди': 'Adventure', 'Детектив': 'Mystery', 'Не вдалося завантажити каталог медіа.': 'Could not load the movie catalog.',
  'Меттью Макконахі': 'Matthew McConaughey', 'Енн Гетевей': 'Anne Hathaway', 'Джессіка Честейн': 'Jessica Chastain', 'Купер': 'Cooper', 'Бренд': 'Brand', 'Мерф': 'Murph',
};

const englishSynopses = {
  'Blade Runner 2049': 'Officer K uncovers a long-buried secret that sends him searching for Rick Deckard.',
  Interstellar: 'A team of explorers travels through a wormhole in search of a new home for humanity.',
  'Dune: Part Two': 'Paul Atreides joins Chani and the Fremen as he seeks revenge against the conspirators.',
  'Lost in Translation': 'An aging actor and a young graduate find an unexpected connection in Tokyo.',
  'The Dark Knight': 'Batman faces the Joker, who plunges Gotham into criminal chaos.',
  Oppenheimer: 'The story of physicist J. Robert Oppenheimer and the development of the first atomic bomb.',
  'Fight Club': 'An office worker and a soap maker create an underground organization.',
  'Pulp Fiction': 'Several intertwined stories unfold in the criminal underworld of Los Angeles.',
  Drive: 'A quiet stunt driver gets into trouble while trying to help his neighbor.',
  Whiplash: 'A young drummer faces a ruthless instructor at a music conservatory.',
  Arrival: 'A linguist attempts to make contact with visitors from another world.',
  'Taxi Driver': 'A Vietnam veteran works as a night taxi driver in New York City.',
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('plota_language') || 'uk');
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  const toggleLanguage = () => setLanguage((current) => {
    const next = current === 'uk' ? 'en' : 'uk';
    localStorage.setItem('plota_language', next);
    return next;
  });
  const value = useMemo(() => ({
    language,
    toggleLanguage,
    t: (text) => language === 'en' ? (translations[text] || text) : text,
    movieTitle: (movie) => language === 'en'
      ? (movie.originalTitle || movie.title).toLocaleUpperCase('en-US')
      : movie.title,
    movieSynopsis: (movie) => language === 'en'
      ? (englishSynopses[movie.originalTitle] || movie.synopsis)
      : movie.synopsis,
    movieDuration: (duration) => language === 'en' ? duration.replace('хв', 'min') : duration,
  }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);
