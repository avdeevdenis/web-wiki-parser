import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';

import { IAppState } from '../../App.typings';

import './ResultsTable.scss';

export interface IProps {
    /**
     * Состояние загрузки
     */
    items: any;

    foundItems: IAppState['foundItems'];
    timeoutedRequestsCount: IAppState['timeoutedRequestsCount'];
};

export class ResultsTable extends Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    shouldComponentUpdate(nextProps: IProps) {
        if (!nextProps.items || !nextProps.items.length && !this.props.items.length) return false;

        if (nextProps.items.length === this.props.items.length &&
            nextProps.items[0] === this.props.items[0]) return false;

        return true;
    }

    setPreBodyInfo() {
        if (this.props.foundItems || this.props.timeoutedRequestsCount) {
            const found = this.props.foundItems;
            const processed = this.props.foundItems - this.props.timeoutedRequestsCount;

            const theSame = found === processed;

            return (
                <tr>
                    <td colSpan={3}>
                        {theSame && `Найдено и обработано страниц: ${found}`}
                        {!theSame && `Всего найдено страниц: ${found}.`}
                        {!theSame && <br />}
                        {!theSame && `Обработано страниц: ${processed}.`}
                        {!theSame && <br />}
                        {!theSame && `Запросов, упавших по таймауту: ${this.props.timeoutedRequestsCount}.`}
                    </td>
                </tr>
            );
        }

        return '';
    }

    render() {
        const items = this.props.items;

        return (
            items && items.length ? 
                <div className='results-table'>
                    <Table striped bordered hover variant="dark">
                        <thead>
                            {this.setPreBodyInfo()}
                            <tr>
                                <th>#</th>
                                <th>Слово</th>
                                <th>Упоминаний</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.key}</td>
                                        <td>{item.value}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </div> :
                ''
        )
    }
}
