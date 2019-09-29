import { initialFetchRequestTimeout } from '../Config';

/**
 * Возвращаемые функцией данные
 */
export interface IFetchResponse {
    /**
     * Затаймаутился ли запрос
     */
    timeout?: boolean;

    /**
     * JSON response в случае успеха
     */
    response?: any;

    /**
     * Произошла ли ошибка во время выполнения запроса
     */
    error?: boolean;

    /**
     * Вспомогательный текст об ошибке
     */
    errorText?: string;
}

type IResolve = (value?: any) => void;
type IReject = (reason?: any) => void;

/**
 * Обертка для fetch, которая умеет возвращать JSON response
 */
export const fetchRequest = (url: string, timeout?: number): Promise<IFetchResponse> => {
    let timers = {};

	return new Promise((resolve, reject) => {
		fetchRequestSetTimeout(timers, url, resolve, timeout);

		return fetch(url)
			.then(response => {
                if (checkCorrectResponseResult(response)) {
                    return response.json();
                }

                reject({
                    error: true,
                    errorText: 'Пришел некорректный ответ от сервера.'
                });
			})
			.then(response => ofFetchSuccess(response, resolve, timers[url]))
			.catch(error => onFetchError(error, reject, url));
	});
};

/**
 * Срабатывает в случае успешного ответа
 */
const ofFetchSuccess = (response: Response, resolve: IResolve, timer: number): void => {
    fetchRequestClearTimeout(timer);

    return resolve({ response });
};

/**
 * Срабатывает в случае ошибки
 */
const onFetchError = (error: string, reject: IReject, url: string): void => {
    return reject({
        error: true,
        errorText: `Произошла ошибка при ajax-запросе [${url}] [${error}]`
    });
};

/**
 * Вернулся ли успешный ответ
 */
const checkCorrectResponseResult = (response: Response): boolean => {
    return response.status === 200 && response.ok;
};

/**
 * Очистка timeout по завершении запроса
 */
const fetchRequestClearTimeout = (timer: number): void => {
    clearTimeout(timer);
};

/**
 * Установка timeout для запроса 
 */
const fetchRequestSetTimeout = (timers: object, url: string, resolve: IResolve, timeout?: number): void => {
    const abortTimeout = (initialFetchRequestTimeout || timeout) * 1000;

    timers[url] = setTimeout(() => {
        resolve({ timeout: true });
    }, abortTimeout);
};
