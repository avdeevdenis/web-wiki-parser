import { IAlertItem } from './Components/Alerts/Alerts';

/**
 * State точки входа в приложение
 */
export interface IAppState {
	/**
	 * Идет ли загрузка результатов
	 */
	loading: boolean;
	
	/**
	 * Ошибки при выполнении программы
	 */
	errors: IAlertItem[];

	/**
	 * Выбранная категория поиска
	 */
	category: string;

	/**
	 * Максимальное число обрабатываемых страниц
	 */
	maxPagesNumber: number;

	/**
	 * Вспомогательный текст
	 */
	loadingText?: string;

	/**
	 * Найденные слова на страницах в порядке популярности
	 */
	resultItems: IResultItem[];

	/**
	 * Открыто ли модальное окно с настройками
	 */
	isSettingsModalOpened: boolean;

	/**
	 * Количество запросов в секунду (если беспорядочно отправлять запросы - будет приходить ответ 429)
	 * (высчитано эмпирически)
	 */
	requestsInSecond: number;

	/**
	 * Максимальное число слов, отображаемых в табличке на экране
	 */
	maxDisplayedPagesCount: number;

	/**
	 * Количество запросов, которые не дождались по тайм-ауту
	 */
	timeoutedRequestsCount: number;

	/**
	 * Количество найденных страниц
	 */
	foundItems: number;

	/**
	 * Время, после которого не дожидаемся ответа сервера
	 */
	fetchRequestTimeout: number;
};

/**
 * Найденные слова на страницах в порядке популярности
 */
export interface IResultItem {
	/**
	 * Само слово
	 */
	key: string;

	/**
	 * Сколько раз найдено
	 */
	value: number;
}

export interface ISearchProps {
	/**
     * Смена селекта категории
     */
    onCategorySelectChange: (event: React.FormEvent<HTMLFormElement>) => void;

    /**
     * Смена максимального количества страниц для парсинга
     */
	onMaxPagesNumberChange: (event: React.FormEvent<HTMLFormElement>) => void;
	onFetchRequestTimeout: (event: React.FormEvent<HTMLFormElement>) => void;
	
	/**
	 * Открытие / закрытие модального окна
	 */
	toggleSettingsModal: () => void;

    onRequestInSecondChange: (event: any) => void;
    onMaxDisplayedResultsCountChange: (event: any) => void;
    
	validateRequestData: (check?: boolean) => boolean;
	
	maxPagesNumber: IAppState['maxPagesNumber'];

	maxDisplayedPagesCount: IAppState['maxDisplayedPagesCount'];
	isSettingsModalOpened: IAppState['isSettingsModalOpened'];
	requestsInSecond: IAppState['requestsInSecond'];
	
    category: IAppState['category'];
	loading: IAppState['loading'];
	loadingText: IAppState['loadingText'];
	fetchRequestTimeout: IAppState['fetchRequestTimeout'];
}

export interface IPropsSettingsModal {
    maxPagesNumber: IAppState['maxPagesNumber'];
	isSettingsModalOpened: IAppState['isSettingsModalOpened'];
	requestsInSecond: IAppState['requestsInSecond'];	
	maxDisplayedPagesCount: IAppState['maxDisplayedPagesCount'];
	fetchRequestTimeout: IAppState['fetchRequestTimeout'];

	onFetchRequestTimeout: ISearchProps['onFetchRequestTimeout'];

	onMaxPagesNumberChange: ISearchProps['onMaxPagesNumberChange'];
    toggleSettingsModal: ISearchProps['toggleSettingsModal']
    onRequestInSecondChange: ISearchProps['onRequestInSecondChange'];
    onMaxDisplayedResultsCountChange: ISearchProps['onMaxDisplayedResultsCountChange'];

    validateRequestData: ISearchProps['validateRequestData'];
};
