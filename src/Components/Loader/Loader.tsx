import React, { Component } from 'react';
import './Loader.scss';

export interface IProps {
    /**
     * Состояние загрузки
     */
    loading: boolean;

    /**
     * Вспомогательный текст
     */
    loadingText?: string;

    /**
     * Получен ли результат
     */
    hasItems: boolean;

    /**
     * Клик по кнопке старта
     */
    onStartClick: (event: any) => void;
};

export class Loader extends Component<IProps, {}> {
    protected faviconSelector: Element;

    constructor(props: IProps) {
        super(props);
    }

    shouldComponentUpdate(nextProps: IProps) {
        if (nextProps.loading !== this.props.loading) return true;

        if (nextProps.hasItems !== this.props.hasItems) return true;

        if (nextProps.loadingText !== this.props.loadingText) return true;

        return false;
    }

    /**
     * Меняем href у favicon во время загрузки
     */
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (!this.faviconSelector) {
            this.faviconSelector = document.querySelector('[rel=\'shortcut icon\']');
        }

        if (nextProps.loading && !this.props.loading) {
            this.faviconSelector.setAttribute('href', './favicon2.ico');
        } else if (!nextProps.loading && this.props.loading) {
            this.faviconSelector.setAttribute('href', './favicon.ico');
        }
	}

    render() {
        return (
            <div className='loader'>
                <a onClick={this.props.onStartClick}
                    className={'loader__link' + (this.props.loading ? ' loader__link_active' : '')}>
                    Start
                    <div className='loader__animate'></div>
                </a>
                {this.props.loadingText && <div className='loader__text'
                    dangerouslySetInnerHTML={{ __html: this.props.loadingText }}
                ></div>}
            </div>
        )
    }
}
