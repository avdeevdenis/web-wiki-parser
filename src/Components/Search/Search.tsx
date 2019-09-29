import React, { Component } from 'react';

import Form from 'react-bootstrap/Form';

import { SettingsModal } from '../SettingsModal/SettingsModal';

import { ISearchProps } from '../../App.typings';

import './Search.scss';

import { categories } from '../../Config';

export class Search extends Component<ISearchProps, {}> {
    getCategories() {
        return categories.map(category => {
            let transformValue = category;

            // только для случайной статьи не нужен постфикс
            if (category !== 'Случайная_статья') {
                transformValue = 'Категория:' + category;
            }

            return (
                <option key={transformValue} value={transformValue}>{category}</option>
            );
        })
    }

    shouldComponentUpdate(nextProps: ISearchProps) {
        // меняется текст у алерта
        if (this.props.loadingText && nextProps.loading && nextProps.loadingText !== this.props.loadingText) return false;

        return true;
    }

    render() {
        return (
            <div className='search'>
                <Form className='search__form'>
                    <Form.Control
                        disabled={this.props.loading}
                        value={this.props.category}
                        onChange={this.props.onCategorySelectChange}
                        as='select'
                    >
                        <option disabled={true} value="">Выберите категорию</option>
                        {this.getCategories()}
                    </Form.Control>
                    <SettingsModal
                        maxPagesNumber={this.props.maxPagesNumber}
                        isSettingsModalOpened={this.props.isSettingsModalOpened}
                        maxDisplayedPagesCount={this.props.maxDisplayedPagesCount}
                        requestsInSecond={this.props.requestsInSecond}
                        fetchRequestTimeout={this.props.fetchRequestTimeout}

                        onMaxPagesNumberChange={this.props.onMaxPagesNumberChange}
                        onRequestInSecondChange={this.props.onRequestInSecondChange}
                        onFetchRequestTimeout={this.props.onFetchRequestTimeout}
                        onMaxDisplayedResultsCountChange={this.props.onMaxDisplayedResultsCountChange}
                        toggleSettingsModal={this.props.toggleSettingsModal}
                        validateRequestData={this.props.validateRequestData}
                    />
                </Form>
            </div>
        )
    }
}
