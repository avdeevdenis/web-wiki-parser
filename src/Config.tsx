/**
 * Здесь содержатся все дефолтные параметры для корректной работы приложения
 */

/**
 * Категории с Wikipedia, страницы на которых будем искать
 * можно попасть на физическую страницу, как 'https://ru.wikipedia.org/wiki/Категория:' + categories[i] (кроме Случайная_статья)
 */
const categories = [
    'Мужские_имена',
    'Породы_собак_по_алфавиту',
    'Животные_по_алфавиту',
    'Теория_чисел',
    'Математическая_логика',
    'JavaScript',
    'Социология',
    'Актрисы_по_алфавиту',
    'Актёры_по_алфавиту',
    'Ютуберы_России',
    'Футболисты_по_алфавиту',
    'Русские_писатели_по_алфавиту',
    'Боги_по_алфавиту',
    'Боевые_искусства_по_алфавиту',
    'Журналы_по_алфавиту',
    'Объекты_Книги_рекордов_Гиннесса',
    'Коктейли_по_алфавиту',
    'Книги_по_алфавиту',
    'Минералы_по_алфавиту',
    'Мобильные_устройства_по_алфавиту',
    'Музыкальные_инструменты_по_алфавиту',
    'Песни_по_алфавиту',
    'Настольные_игры_по_алфавиту',
    'Грибы_по_алфавиту',
    'Бактерии_по_алфавиту',
    'Вирусы_по_алфавиту',
    'Растения_по_алфавиту',
    'Телеканалы_по_алфавиту',
    'Сыры_по_алфавиту',
    'Физические_величины_по_алфавиту',
    'Флаги_по_алфавиту',
    'Этнические_группы_по_алфавиту',
    'Ядерные_реакторы_по_алфавиту',
    'Женские_имена',
    'Случайная_статья'
].sort();

/**
 * Максимально допустимое число обрабатываемых страниц
 */
const maxAvaliablePagesCount: number = 10000;
const initialMaxAvaliablePagesCount: number = 20; // значение по-умолчанию

/**
 * Максимально допустимое число запросов в секунду
 */
const maxAvaliableRequestsInSecond: number = 150;
const initialMaxAvaliableRequestsInSecond: number = 50; // значение по-умолчанию

/**
 * Максимальное количество найденных слов, отображаемых на странице
 */
const maxAvaliableDisplayedResultsCount: number = 1000;
const initialMaxAvaliableDisplayedResultsCount: number = 100; // значение по-умолчанию

/**
 * Время, после которого не дожидаемся ответа сервера
 */
const maxAvaliableFetchRequestTimeout: number = 30; 
const initialFetchRequestTimeout: number = 7;

export {
    categories,

    maxAvaliablePagesCount,
    initialMaxAvaliablePagesCount,

    maxAvaliableRequestsInSecond,
    initialMaxAvaliableRequestsInSecond,

    maxAvaliableDisplayedResultsCount,
    initialMaxAvaliableDisplayedResultsCount,

    initialFetchRequestTimeout,
    maxAvaliableFetchRequestTimeout
};
