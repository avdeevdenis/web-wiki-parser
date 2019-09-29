import React from 'react';

import { Search } from './Components/Search/Search';
import { Alerts, IAlertItem } from './Components/Alerts/Alerts';
import { Loader } from './Components/Loader/Loader';
import { ResultsTable } from './Components/ResultsTable/ResultsTable';
import { HowItWorks } from './Components/HowItWorks/HowItWorks';

import smoothscroll from 'smoothscroll-polyfill';

import { WikiParser } from './Tools/WikiParser';
import { IAppState } from './App.typings';

import {
	maxAvaliablePagesCount,
    initialMaxAvaliablePagesCount,

    maxAvaliableRequestsInSecond,
    initialMaxAvaliableRequestsInSecond,

    maxAvaliableDisplayedResultsCount,
	initialMaxAvaliableDisplayedResultsCount,

	maxAvaliableFetchRequestTimeout,
	initialFetchRequestTimeout
} from './Config';

/**
 * Класс-парсер википедии
 */
const wikiParser = new WikiParser();

import './Scss/index.scss';

export default class App extends React.Component<{}, IAppState> {
	/**
	 * Время до автозакрытия алерта
	 */
	protected autoCloseAlertTimeout: number = 5000;

	/**
	 * Селектор, к которому происходит доскролл после отрисовки таблицы
	 */
	protected resultsTableSelector: Element | null = null;

	constructor(props) {
		super(props);

		smoothscroll.polyfill();

		// input data
		this.onCategorySelectChange = this.onCategorySelectChange.bind(this);
		this.onMaxPagesNumberChange = this.onMaxPagesNumberChange.bind(this);
		this.onRequestInSecondChange = this.onRequestInSecondChange.bind(this);
		this.onMaxDisplayedResultsCountChange = this.onMaxDisplayedResultsCountChange.bind(this);
		this.onFetchRequestTimeout = this.onFetchRequestTimeout.bind(this);
		this.isValidValue = this.isValidValue.bind(this);
		this.validateRequestData = this.validateRequestData.bind(this);

		// ui actions
		this.onStartClick = this.onStartClick.bind(this);
		this.onCloseAlert = this.onCloseAlert.bind(this);
		this.toggleSettingsModal = this.toggleSettingsModal.bind(this);

		this.setLoadingText = this.setLoadingText.bind(this);

		this.state = this.getDefaultState();
	}

	getDefaultState(): IAppState {
		const localStorage = window.localStorage;

		// берем значение из localstorage или по-умолчанию
		const maxPagesNumber = localStorage && Number(localStorage.getItem('maxPagesNumber')) ||
			initialMaxAvaliablePagesCount;
		const requestsInSecond = localStorage && Number(localStorage.getItem('requestsInSecond')) ||
			initialMaxAvaliableRequestsInSecond;
		const maxDisplayedPagesCount = localStorage && Number(localStorage.getItem('maxDisplayedPagesCount')) ||
			initialMaxAvaliableDisplayedResultsCount;

		const category = localStorage && localStorage.getItem('category') || '';
		const fetchRequestTimeout = localStorage && Number(localStorage.getItem('fetchRequestTimeout')) ||
			initialFetchRequestTimeout;

		return {
			loading: false,
			errors: [],
			loadingText: '',
			resultItems: [],
			isSettingsModalOpened: false,
			maxPagesNumber,
			requestsInSecond,
			maxDisplayedPagesCount,
			category,
			timeoutedRequestsCount: 0,
			foundItems: 0,
			fetchRequestTimeout
		};
	}

	/**
	 * 100vh на мобильных
	 */
	setDocumentVhCssProperty(): void {
		document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
	}

	componentDidMount(): void {
		this.setDocumentVhCssProperty();

		window.addEventListener('resize', () => {
			this.setDocumentVhCssProperty();
		});

		window.addEventListener('orientationchange', () => {
			this.setDocumentVhCssProperty();
		});
	}

	/**
	 * Устанавливает текст, который показыается под лоадером
	 */
	setLoadingText(text: string): void {
		this.setState({
			...this.state,
			loading: true,
			loadingText: text
		});
	}

	/**
	 * Изменение количества запросов в секунду
	 */
	onRequestInSecondChange(e): void {
		const requestsInSecond = e.target.value;

		this.setState({
			...this.state,
			requestsInSecond
		});
	}

	/**
	 * Изменение количества времени ожидания одного запроса
	 */
	onFetchRequestTimeout(e) {
		const fetchRequestTimeout = e.target.value;

		this.setState({
			...this.state,
			fetchRequestTimeout
		});
	}

	/**
	 * Изменение количества отображаемых результатов
	 */
	onMaxDisplayedResultsCountChange(e): void {
		const maxDisplayedPagesCount = e.target.value;

		this.setState({
			...this.state,
			maxDisplayedPagesCount
		});
	}

	/**
	 * Изменение категории для парсинга
	 */
	onCategorySelectChange(e): void {
		const category = e.target.value;

		if (category) {
			this.setState({
				...this.state,
				category
			});
		}
	}

	/**
	 * Изменение максимального числа страниц, обходимых парсером
	 */
	onMaxPagesNumberChange(e): void {
		const maxPagesNumber = e.target.value;

		this.setState({
			...this.state,
			maxPagesNumber
		});
	}

	/**
	 * Показать - скрыть окно настроек
	 */
	toggleSettingsModal(): void {
		this.setState({
			...this.state,
			isSettingsModalOpened: !this.state.isSettingsModalOpened
		});
	}


	/**
	 * Корректно ли задано значение
	 */
	isValidValue(count: string | number, maxCount: number): boolean {
		count = Number(count);

		return !isNaN(count) && count <= maxCount && count > 0;	
	}

	/**
	 * Клик по большой кнопке "start"
	 */
	onStartClick(): void {
		this.validateAndSendRequest();
	}

	/**
	 * Клик по всплывающему предупреждению
	 */
	onCloseAlert(index: number): void {
		let errors = [...this.state.errors];

		if (errors[index]) {
			errors[index].visible = false;
		}

		// если все скрыты - чистим массив
		if (errors.every(error => !error.visible)) {
			errors = [];
		}

		this.setState({
			...this.state,
			errors
		});
	}

	/**
	 * Валидируем поля и отправляем запрос
	 */
	validateAndSendRequest() {
		if (this.state.loading) {
			return;
		}

		const isValidated = this.validateRequestData();

		if (!isValidated) return;

		this.setState({
			...this.state,
			loading: true,
			resultItems: [],
			errors: [],
			loadingText: 'Начинаем обработку данных'
		});

		const localStorage = window.localStorage;

		if (localStorage) {
			localStorage.setItem('maxPagesNumber', String(this.state.maxPagesNumber));
			localStorage.setItem('requestsInSecond', String(this.state.requestsInSecond));
			localStorage.setItem('maxDisplayedPagesCount', String(this.state.maxDisplayedPagesCount));
			localStorage.setItem('category', this.state.category);
		}

		this.parse();
	}

	/**
	 * Проверяет корректность всех передаваемых данных
	 */
	validateRequestData(skipCategoryCheck?: false): boolean {
		let hasInternetConnection = true;
		const navigator = window.navigator as any;
		
		if (navigator && navigator.connection) {
			if (navigator.connection.downlink === 0 && navigator.connection.rtt === 0) {
				hasInternetConnection = false;
			}
		}

		if (!hasInternetConnection) {
			this.generateAlert({
				description: 'Пропало соединение с интернетом.',
				variant: 'danger'
			});

			return false;
		}

		const {
			category, maxPagesNumber, maxDisplayedPagesCount, requestsInSecond, fetchRequestTimeout
		} = this.state;

		// при валидации полей в модальном окне не нужно учитывать селект категории
		if (!skipCategoryCheck) {
			if (!category.length) {
				this.generateAlert({
					description: 'Необходимо выбрать категорию.',
					variant: 'danger'
				});

				return false;
			}
		}

		if (!this.isValidValue(maxPagesNumber, maxAvaliablePagesCount)) {
			this.generateAlert({
				description: `Некорректное количество страниц. Должно быть меньше <b>${maxAvaliablePagesCount}</b>.`,
				variant: 'danger'
			});

			return false;
		}

		if (!this.isValidValue(maxDisplayedPagesCount, maxAvaliableDisplayedResultsCount)) {
			this.generateAlert({
				description: `Некорректное количество выводимых результатов. Должно быть меньше <b>${maxAvaliableDisplayedResultsCount}</b>.`,
				variant: 'danger'
			});

			return false;
		}

		if (!this.isValidValue(requestsInSecond, maxAvaliableRequestsInSecond)) {
			this.generateAlert({
				description: `Некорректное количество запросов в секунду. Должно быть меньше <b>${maxAvaliableRequestsInSecond}</b>`,
				variant: 'danger'
			});

			return false;
		}

		if (!this.isValidValue(fetchRequestTimeout, maxAvaliableFetchRequestTimeout)) {
			this.generateAlert({
				description: `Некорректное время ожидания ответа. Должно быть меньше <b>${maxAvaliableFetchRequestTimeout}</b>`,
				variant: 'danger'
			});

			return false;
		}

		return true;
	}

	/**
	 * Парсинг результатов - точка входа в модуль WikiParser
	 */
	parse(): void {
		const options = {
			category: this.state.category,
			maxPagesNumber: this.state.maxPagesNumber,
			maxDisplayedPagesCount: this.state.maxDisplayedPagesCount,
			requestsInSecond: this.state.requestsInSecond,
			setLoadingText: this.setLoadingText,
		};

		wikiParser.parse(options)
			.then(response => {
				const { resultItems, timeoutedRequestsCount, foundItems  } = response as any;

				this.setState({
					...this.state,
					resultItems,
					loading: false,
					loadingText: '',
					timeoutedRequestsCount,
					foundItems
				});

				const resultsTableSelector = document.querySelector('.results-table');
				resultsTableSelector && resultsTableSelector.scrollIntoView({ behavior: 'smooth' });
			})
			.catch(error => {
				this.generateAlert({
					variant: 'danger',
					description: error
				});

				this.setState({
					...this.state,
					loading: false,
					loadingText: ''
				});
			});
	}

	/**
	 * Генерирует всплывающее предупреждение
	 */
	generateAlert({ headerText, description, variant }: IAlertItem): void {
		const errors = [...this.state.errors];

		if (!headerText) {
			if (variant === 'warning') {
				headerText = 'Предупреждение';
			} else if (variant === 'danger') {
				headerText = 'Произошла ошибка'
			}
		}

		const index = errors.push({
			headerText,
			description,
			variant,
			visible: true
		});

		/**
		 * Скрываем алерт через timeout
		 */
		setTimeout(index => {
			this.onCloseAlert(index);
		}, this.autoCloseAlertTimeout, index - 1);

		this.setState({
			...this.state,
			errors
		});
	}

	render() {
		const { loading, resultItems } = this.state;

		return (
			<div className='page'>
				<Search
					onCategorySelectChange={this.onCategorySelectChange}
					onMaxPagesNumberChange={this.onMaxPagesNumberChange}
					toggleSettingsModal={this.toggleSettingsModal}
					onRequestInSecondChange={this.onRequestInSecondChange}
					onMaxDisplayedResultsCountChange={this.onMaxDisplayedResultsCountChange}
					onFetchRequestTimeout={this.onFetchRequestTimeout}
					validateRequestData={this.validateRequestData}

					category={this.state.category}
					requestsInSecond={this.state.requestsInSecond}
					maxPagesNumber={this.state.maxPagesNumber}
					maxDisplayedPagesCount={this.state.maxDisplayedPagesCount}
					isSettingsModalOpened={this.state.isSettingsModalOpened}
					loading={loading}
					loadingText={this.state.loadingText}
					fetchRequestTimeout={this.state.fetchRequestTimeout}
				/>
				<Loader
					loading={loading}
					loadingText={this.state.loadingText}
					hasItems={resultItems.length > 0}
					onStartClick={this.onStartClick}
				/>
				<ResultsTable
					items={resultItems}
					timeoutedRequestsCount={this.state.timeoutedRequestsCount}
					foundItems={this.state.foundItems}
				/>
				<HowItWorks
					hasItems={resultItems.length > 0}
					loading={this.state.loading}
				/>
				<Alerts
					items={this.state.errors}
					onCloseAlert={this.onCloseAlert}
				/>
			</div>
		);
	}
}
