"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var categories = [
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
exports.categories = categories;
var maxAvaliablePagesCount = 10000;
exports.maxAvaliablePagesCount = maxAvaliablePagesCount;
var initialMaxAvaliablePagesCount = 20;
exports.initialMaxAvaliablePagesCount = initialMaxAvaliablePagesCount;
var maxAvaliableRequestsInSecond = 150;
exports.maxAvaliableRequestsInSecond = maxAvaliableRequestsInSecond;
var initialMaxAvaliableRequestsInSecond = 50;
exports.initialMaxAvaliableRequestsInSecond = initialMaxAvaliableRequestsInSecond;
var maxAvaliableDisplayedResultsCount = 1000;
exports.maxAvaliableDisplayedResultsCount = maxAvaliableDisplayedResultsCount;
var initialMaxAvaliableDisplayedResultsCount = 100;
exports.initialMaxAvaliableDisplayedResultsCount = initialMaxAvaliableDisplayedResultsCount;
var maxAvaliableFetchRequestTimeout = 30;
exports.maxAvaliableFetchRequestTimeout = maxAvaliableFetchRequestTimeout;
var initialFetchRequestTimeout = 7;
exports.initialFetchRequestTimeout = initialFetchRequestTimeout;
