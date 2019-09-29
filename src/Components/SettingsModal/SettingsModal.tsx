import React, { Component } from 'react';

import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl'

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { Help, Settings } from '../Icons/Icons';

import { IPropsSettingsModal } from '../../App.typings';

import {
	maxAvaliablePagesCount,
    maxAvaliableRequestsInSecond,
    maxAvaliableDisplayedResultsCount,
	maxAvaliableFetchRequestTimeout
} from '../../Config';

import './SettingsModal.scss';

export class SettingsModal extends Component<IPropsSettingsModal, {}> {
    constructor(props: IPropsSettingsModal) {
        super(props);

        this.onClose = this.onClose.bind(this);
    }

    onClose() {
        if (this.props.validateRequestData(true)) {
            this.props.toggleSettingsModal();
        }
    }

    shouldComponentUpdate(nextProps: IPropsSettingsModal) {
        if (
            nextProps.maxPagesNumber !== this.props.maxPagesNumber ||
            nextProps.isSettingsModalOpened !== this.props.isSettingsModalOpened ||
            nextProps.requestsInSecond !== this.props.requestsInSecond ||
            nextProps.maxDisplayedPagesCount !== this.props.maxDisplayedPagesCount ||
            nextProps.fetchRequestTimeout !== this.props.fetchRequestTimeout
        ) return true;

        return false;
    }

    render() {
        const maxPagesNumber = this.props.maxPagesNumber.toString();
        const maxDisplayedPagesCount = this.props.maxDisplayedPagesCount.toString();
        const requestsInSecond = this.props.requestsInSecond.toString();

        const fetchRequestTimeout = this.props.fetchRequestTimeout.toString();

        const ModalBody = 
            <Modal.Body>
                <div className='settings__item'>
                    <Form.Text className='text-muted'>
                        Количество страниц (max {maxAvaliablePagesCount})<Help className='settings__help'
                        tooltipText='Максимальное количество страниц, слова на которых будут парситься'/>
                    </Form.Text>
                    <FormControl
                        type='text'
                        className='search__item'
                        placeholder='Количество страниц'
                        aria-label='Количество страниц'
                        aria-describedby='Количество страниц'
                        value={maxPagesNumber}
                        onChange={e => this.props.onMaxPagesNumberChange(e)}
                    />
                </div>
                <div className='settings__item'>
                    <Form.Text className='text-muted'>
                        Показать результатов (max {maxAvaliableDisplayedResultsCount})<Help className='settings__help'
                        tooltipText='Максимальное количество найденных слов, отображаемых на странице'/>
                    </Form.Text>
                    <FormControl
                        type='text'
                        className='search__item'
                        placeholder='Количество результатов'
                        aria-label='Количество результатов'
                        aria-describedby='Количество результатов'
                        value={maxDisplayedPagesCount}
                        onChange={e => this.props.onMaxDisplayedResultsCountChange(e)}
                    />
                </div>
                <div className='settings__item'>
                    <Form.Text className='text-muted'>
                        Запросов в секунду (max {maxAvaliableRequestsInSecond})<Help className='settings__help'
                        tooltipText='Максимальное число отправляемых запросов к Википедии за секунду'/>
                    </Form.Text>
                    <FormControl
                        type='text'
                        className='search__item'
                        placeholder='Запросов в секунду'
                        aria-label='Запросов в секунду'
                        aria-describedby='Запросов в секунду'
                        value={requestsInSecond}
                        onChange={e => this.props.onRequestInSecondChange(e)}
                    />
                </div>
                <div className='settings__item'>
                    <Form.Text className='text-muted'>
                        Время ожидания ответа (max {maxAvaliableFetchRequestTimeout})<Help className='settings__help'
                        tooltipText='Максимальное время ожидания ответа от сервера в секундах на один запрос (если оно первысится - не дожидаемся)'/>
                    </Form.Text>
                    <FormControl
                        type='text'
                        className='search__item'
                        placeholder='Время ожидания ответа в секундах'
                        aria-label='Время ожидания ответа в секундах'
                        aria-describedby='Время ожидания ответа в секундах'
                        value={fetchRequestTimeout}
                        onChange={e => this.props.onFetchRequestTimeout(e)}
                    />
                </div>
            </Modal.Body>;

        return (
            <>
                <Settings onClick={this.props.toggleSettingsModal}/>
                <Modal show={this.props.isSettingsModalOpened} onHide={this.props.toggleSettingsModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Настройки</Modal.Title>
                    </Modal.Header>
                    {ModalBody}
                    <Modal.Footer>
                        <Button variant='success' onClick={this.onClose}>
                            Сохранить
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}
