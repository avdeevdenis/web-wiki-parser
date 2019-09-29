import React, { Component } from 'react';
import Alert from 'react-bootstrap/Alert';

import './Alerts.scss';

export interface IProps {
    /**
     * Предупреждения
     */
    items: IAlertItem[];

    /**
     * Действие на скрытие алерта
     */
    onCloseAlert: (index: number) => void;
};

export interface IAlertItem {
	/**
	 * Заголовок предупреждения
	 */
	headerText?: string;

	/**
	 * Текст предупреждения
	 */
	description: string;

	/**
	 * Скрыт ли элемент
	 */
	visible?: boolean;

	/**
	 * Тип алерта
	 */
	variant: 'danger' | 'warning';
}

export class Alerts extends Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);

        this.alertMap = this.alertMap.bind(this);
    }

    shouldComponentUpdate(nextProps: IProps) {
        if (this.props.items.length && !nextProps.items.length) return true;

        if (!nextProps.items || !nextProps.items.length) return false;

        return true;
    }

    alertMap(item, index, arr) {
        const { onCloseAlert } = this.props;

        return (
            item.visible &&
                <Alert
                    key={arr.length - index - 1} variant={item.variant}
                    onClose={() => onCloseAlert(arr.length - index - 1)}
                    onClick={() => onCloseAlert(arr.length - index - 1)}
                    dismissible
                >
                {item.headerText &&
                    <Alert.Heading>{item.headerText}</Alert.Heading>
                }
                {item.description &&
                    <p
                        className='alert-description'
                        dangerouslySetInnerHTML={{ __html: item.description }}
                    ></p>
                }
                </Alert>
        );
    }

    render() {
        const { items } = this.props;
        const hasItems = items && items.length > 0;

        const reverseItems = [...items].reverse();

        return (
            hasItems && <div className='alerts'>
                {reverseItems.map(this.alertMap)}
            </div>
        )
    }
}
