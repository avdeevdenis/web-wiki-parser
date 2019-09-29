import React from 'react';
import * as HTMLParser from 'node-html-parser';

import { ExcludeWords } from './ExcludeWords';
import { fetchRequest } from './FetchRequest';

interface IPageItem {
	/**
	 * Само слово
	 */
	key: string;

	/**
	 * Количество вхождений данного слова
	 */
	value: number;
}

interface IFetchParams {
	/**
	 * Нужное действие
	 */
	action: 'query' | 'parse';

	generator?: 'categorymembers',

	format: 'json';

	/**
	 * Лимит на количество записей
	 */
	gcmlimit?: number;

	/**
	 * Тайтл категории, которую необходимо найти
	 */
	gcmtitle?: string;

	/**
	 * Enable CORS
	 */
	origin: string;

	/**
	 * Страница, которую необходимо найти
	 */
	page?: string;

	prop?: 'text';

	/**
	 * Параметры из ответа ручки, которые приходят в случае, если есть еще результаты
	 */
	continue?: string;
	gcmcontinue?: string;
	rncontinue?: string;

	rnlimit?: number;
	list?: 'random';
};

export class WikiParser extends React.Component {
	/**
	 * API URL для доступа в википедию
	 */
	private API_URL: string = 'https://ru.wikipedia.org/w/api.php?';

	/**
	 * Максимальное число обрабатываемых страниц
	 */
	private maxPagesNumber: number;

	/**
	 * Заголовки страниц, которые нужно парсить
	 */
	public pageHeaders: string[] = [];

	/**
	 * Допустимое число обрабатываемых страниц по-умолчанию (ограничение википедии)
	 */
	public maxAvaliablePagesCountByWikipedia: number = 500;

	/**
	 * Максимальное число слов, отображаемых в табличке на экране
	 */
	public maxDisplayedPagesCount: number;

	/**
	 * Проинитились ли скрипты для морфологической обработки слов
	 */
	public isAzMorphInited: boolean = false;

	/**
	 * Устанавливает нужный текст лоадеру
	 */
	public setLoadingText: (text: string) => void;

	/**
	 * Количество запросов, прерванных по таймауту
	 */
	public timeoutedRequestsCount: number = 0;

	/**
	 * Количество запросов в секунду (если беспорядочно отправлять запросы - будет приходить ответ 429)
	 * (высчитано эмпирически)
	 */
	public requestsInSecond: number;

	constructor(props?) {
		super(props);

		this.parseUrls = this.parseUrls.bind(this);
		this.breakTextOnWords = this.breakTextOnWords.bind(this);
		this.getSortedWords = this.getSortedWords.bind(this);
		this.excludeSpecificWords = this.excludeSpecificWords.bind(this);
		this.combineByDictionary = this.combineByDictionary.bind(this);
		this.prepareResult = this.prepareResult.bind(this);
	}

	/**
	 * Точка входа - Парсинг страниц с википедии
	 */
	parse(options): Promise<Object> {
		/**
		 * Непосредственно перед парсингом очищаем предыдущие настройки и задаем новые
		 */
		this.setDefaultSettings(options);

		return new Promise((resolve, reject) => {
			this.getParsedUrls(options)
				.then(this.parseUrls)
				.then(this.breakTextOnWords)
				.then(this.combineByDictionary)
				.then(this.excludeSpecificWords)
				.then(this.getSortedWords)
				.then(this.prepareResult)
				.then(result => resolve(result))
				.catch(error => reject(error));
		});
	}

	/**
	 * Отправляем результат
	 */
	prepareResult(words) {
		const result = {
			resultItems: words,
			foundItems: this.pageHeaders.length,
			timeoutedRequestsCount: this.timeoutedRequestsCount
		};

		return result;
	}

	/**
	 * Сверяемся со словарем и соединяем похожие слова в одно, например (австралийский, австралийская, автстралийское)
	 */
	combineByDictionary(words) {
		return new Promise((resolve, reject) => {
			if (!this.isAzMorphInited) {
				this.setLoadingText('Загружаем морфологический словарь.');

				(window as any).Az.Morph.init('dictionary', () => {
					this.isAzMorphInited = true;
					return resolve(this.morphWords(words));
				});
			} else {
				return resolve(this.morphWords(words));
			}
		})
		.catch(error => 'Произошла ошибки при объединении слов по словарю. ' + JSON.stringify(error));
	}

	/**
	 * Сверяемся со словарем и соединяем похожие слова в одно, например (австралийский, австралийская, автстралийское)
	 */
	morphWords(words) {
		const keys = Object.keys(words);
		const newWords = {};

		keys.forEach(key => {
			const morph = (window as any).Az.Morph(key);

			// на этом этапе теряем все слова, которых нет в словаре и считаем, что это ок
			if (morph.length) {
				const wordInNormalForm = morph[0].normalize().word;

				if (wordInNormalForm) {
					if (newWords[wordInNormalForm]) {
						newWords[wordInNormalForm] = newWords[wordInNormalForm] + words[key];
					} else {
						newWords[wordInNormalForm] = words[key];
					}
				}
			}
		});

		return newWords;
	}

	/**
	 * Получить заголовки страниц, которые необходимо парсить
	 */
	getHeaders(options) {
		return new Promise((resolve, reject) => {
			if (!options.category || !options.maxPagesNumber) {
				reject('Не переданы обязательные параметры для запроса.');
			}

			const isRandomArticle = options.category === 'Случайная_статья';
			let additionOptions;

			if (isRandomArticle) {
				additionOptions = this.getFetchParamsQueryRandom(options);
			} else {
				additionOptions = this.getFetchParamsQuery(options);
			}

			const queryOptions = { ...additionOptions, ...options };

			const url = this.getFetchUrl(queryOptions);

			fetchRequest(url)
				.then(({ response }) => {
					const pagesResponse = isRandomArticle ?
						response && response.query && response.query.random :
						response && response.query && response.query.pages;

					if (!pagesResponse) {
						reject('Не пришел корректный ответ от сервера с заголовками страниц.');
					}

					let pageHeadersLength = this.pageHeaders.length;

					const pages = Object.keys(pagesResponse);

					for (let i = 0, l = pages.length; i < l; i++) {
						pageHeadersLength = this.pageHeaders.push(pagesResponse[pages[i]].title);

						if (pageHeadersLength === this.maxPagesNumber) {
							return resolve(this.pageHeaders);
						}
					}

					if (response.continue) {
						const continueOptions = this.prepareContinueOptions(response.continue);

						Object.keys(continueOptions).forEach(key => queryOptions[key] = continueOptions[key]);

						const delta = this.maxPagesNumber - pageHeadersLength;

						if (delta < this.maxAvaliablePagesCountByWikipedia) {
							if (isRandomArticle) {
								queryOptions.rnlimit = delta;
							} else {
								queryOptions.gcmlimit = delta;
							}
						}

						return this.getHeaders(queryOptions)
							.then(result => resolve(result));
					} else {	
						return resolve(this.pageHeaders);
					}
				})
				.catch(error => reject(error));
		});
	}

	/**
	 * js запрещает использовать 'continue' в качестве ключа, заменим на 'safeContinue'
	 */
	prepareContinueOptions(continueOptions) {
		if (continueOptions.continue) {
			continueOptions.safeContinue = continueOptions.continue;
			delete continueOptions.continue;
		}

		return continueOptions;
	}

	/**
	 * Возвращает url's для парсинга
	 */
	getParsedUrls(options): Promise<string[]> {
		return new Promise((resolve, reject) => {
			this.getHeaders(options)
				.then((headers: string[]) => {
					const urls = headers.map(header => {
						const parseOptions = this.getFetchParamsParse(header);

						return this.getFetchUrl({ ...options, ...parseOptions });
					});

					return resolve(urls);
				})
				.catch(error => reject('Произошла ошибка при составлении урлов для парсинга. ' + JSON.stringify(error)));
		});
	}

	/**
	 * Устанавливаем дефолтные настройки перед запросом
	 */
	setDefaultSettings(options) {
		this.maxPagesNumber = Number(options.maxPagesNumber);

		this.pageHeaders = [];

		this.setLoadingText = options.setLoadingText;

		this.requestsInSecond = options.requestsInSecond;
		this.maxDisplayedPagesCount = options.maxDisplayedPagesCount;
	}

	/**
	 * Исключаем специфические слова из выборки
	 */
	excludeSpecificWords(words) {
		return new Promise((resolve, reject) => {
			resolve(ExcludeWords.exclude(words));
		});
	}

	/**
	 * Парсит урлы
	 */
	parseUrls(urls: string[]) {
		return new Promise((resolve, reject) => {
			if (urls && !urls.length) {
				return reject('Не найдено урлов для парсинга.');
			}

			const allPromises = [];
			const foundPagesCount = urls.length;

			urls.forEach((url, index) => {
				const isLastIndex = index === foundPagesCount - 1;
				const onePromise = this.fetchAndProcessingWikiPage(url, index, foundPagesCount, isLastIndex);
				allPromises.push(onePromise);
			});

			return Promise.all(allPromises)
				.then(result => resolve(result));
		});
	}

	/**
	 * Разбивает входной текст на слова
	 */
	breakTextOnWords(texts: string[]): Promise<Object> {
		return new Promise((resolve, reject) => {
			const words = {};

			texts.forEach(text => {
				let word = '';

				for (let i = 0, l = text.length; i < l; i++) {
					let char = text.charAt(i);
					const charCode = char.charCodeAt(0);

					// 1072 - а
					// 1103 - я
					// 1105 - ё
					// 1040 - А
					// 1071 - Я
					// 1025 - Ё
					// 45 - '-'

					if (
						(charCode >= 1072 && charCode <= 1103 || charCode === 1105) ||
						(charCode >= 1040 && charCode <= 1071 || charCode === 1025) ||
						charCode === 45 && word.length
					) {
						word += char;
					} else if (word.length === 1) {
						// считаем нерелевантными слова из 1 символа
						word = '';
					} else if (word.length > 1) {
						word = word.toLocaleLowerCase();

						words[word] = words[word] ? words[word] + 1 : 1;
						word = '';
					}
				}
			});

			resolve(words);
		});
	}

	/**
	 * Возвращает отсортированные объект с найденными словами по частоте упоминания каждого слова
	 */
	getSortedWords(words: object): IPageItem[] {
		/**
     	* Сортировка найденных слов по убыванию количества упоминаний слова
		*/
		const sortedKeys = Object.keys(words).sort((w1, w2) => {
			let word1 = words[w1];
			let word2 = words[w2];

			if (word1 === word2) return 0;

			return word1 < word2 ? 1 : -1;
		});

		const sortedWords = sortedKeys.map(key => ({
			key,
			value: words[key]
		}));

		return sortedWords.slice(0, Math.min(sortedWords.length, this.maxDisplayedPagesCount));
	}

	/**
	 * Фетчим отдельный запрос на вики-страницу за содержимым
	 */
	fetchAndProcessingWikiPage(url: string, index: number, foundPagesCount: number, isLastIndex: boolean): Promise<string> {
		const timeoutDelay = 1000 / this.requestsInSecond * (index + 1);

		return new Promise(resolve => {
			setTimeout(() => {
				const maxAvailiblePagesCount = Math.min(foundPagesCount, this.maxPagesNumber);

				if (isLastIndex) {
					this.setLoadingText('Дожидаемся загрузки всех результатов');
				} else if ((index + 1) % 10 === 0) {
					this.setLoadingText(`Отправляем запросы<br><b>${index + 1}</b> из <b>${maxAvailiblePagesCount}</b>`);
				}

				fetchRequest(url)
					.then(({ response, timeout }) => {
						// не нарушаем цепочку промисов если до какого-то url'а не достучались
						if (timeout) {
							this.timeoutedRequestsCount++;
							console.log(`%cНе дождались результата по таймауту '${decodeURIComponent(url)}'`, 'color: Green');
							resolve('');
						}

						const text = response && response.parse && response.parse.text && response.parse.text['*'];

						if (text) {
							try {
								resolve(HTMLParser.parse(text).text);
							} catch (e) {
								// не нарушаем цепочку промисов если произошла ошибка
								console.log(`Ошибка при работе HTMLParser'а. ${JSON.stringify(e)}`);
								resolve('');
							}
						} else {
							// не нарушаем цепочку промисов если почему-то нет text'а
							resolve('');
						}
					})
					.catch(error => {
						// не нарушаем цепочку промисов если до какого-то url'а не достучались
						console.log(`Произошла ошибка при парсинге страницы: '${decodeURIComponent(url)}'. ${JSON.stringify(error)}`);
						resolve('');
					});
			}, timeoutDelay);
		});
	}

	/**
	 * Возвращает параметры для fetch запроса
	 */
	getFetchParams(params): Object {
		const {
			generator, action,
			gcmtitle, gcmlimit,
			page, prop,
			safeContinue, gcmcontinue, rncontinue,
			rnlimit, list
		} = params;

		const options: IFetchParams = {
			action: action,
			format: 'json',
			origin: '*'
		};

		if (generator) {
			options.generator = generator;
		}

		if (gcmtitle) {
			options.gcmtitle = gcmtitle;
		}

		if (gcmlimit) {
			options.gcmlimit = gcmlimit;
		}

		if (page) {
			options.page = page;
		}

		if (prop) {
			options.prop = prop;
		}

		if (gcmcontinue) {
			options.gcmcontinue = gcmcontinue;
		}

		if (rncontinue) {
			options.rncontinue = rncontinue;
		}

		if (safeContinue) {
			options.continue = safeContinue;
		}

		if (rnlimit) {
			options.rnlimit = rnlimit;
		}

		if (list) {
			options.list = list;
		}

		return options;
	}

	/**
	 * Вовзращает fetch-параметры для запроса с action=query
	 */
	getFetchParamsQuery(options) {
		return {
			action: 'query',
			generator: 'categorymembers',
			gcmlimit: options.maxPagesNumber > this.maxAvaliablePagesCountByWikipedia ?
				this.maxAvaliablePagesCountByWikipedia : options.maxPagesNumber,
			gcmtitle: encodeURIComponent(options.category)
		};
	}

	/**
	 * Вовзращает fetch-параметры для запроса с action=query для рандомных страниц
	 */
	getFetchParamsQueryRandom(options) {
		return {
			action: 'query',
			rnlimit: options.maxPagesNumber > this.maxAvaliablePagesCountByWikipedia ?
				this.maxAvaliablePagesCountByWikipedia : options.maxPagesNumber,
			list: 'random'
		};
	}

	/**
	 * Вовзращает fetch-параметры для запроса с action=parse
	 */
	getFetchParamsParse(header: string) {
		return {
			action: 'parse',
			page: encodeURIComponent(header),
			prop: 'text'
		};
	}

	/**
	 * Возвращает урл для fetch запроса
	 */
	getFetchUrl(params: IFetchParams): string {
		let options = this.getFetchParams(params);

		let url = this.API_URL;

		Object.keys(options).forEach(key => url += '&' + key + '=' + options[key]);

		return url;
	}
}
