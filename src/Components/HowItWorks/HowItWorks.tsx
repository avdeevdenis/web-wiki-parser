import React, { Component } from 'react';

import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import './HowItWorks.scss';

export interface IProps {
    /**
     * Получен ли результат
     */
	hasItems: boolean;
	
	/**
     * Состояние загрузки
     */
	loading: boolean;
};

export class HowItWorks extends Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
	}
	
	shouldComponentUpdate(nextProps: IProps) {
		if (nextProps.loading !== this.props.loading) return true;

		if (nextProps.hasItems !== this.props.hasItems) return true;

		return false;
	}

    render() {
	    function HowItWorks(options) {
			const [show, setShow] = React.useState(false);
		  
			const handleClose = () => setShow(false);
			const handleShow = () => setShow(true);
		  
			return (
			  	<>
					<div onClick={handleShow} className={'how-it-works' + (options.hasItems ? ' how-it-works_relative' : '')}>
						<Badge variant='secondary'>Как это работает?</Badge>
					</div>
				
					<Modal className='how-it-works__modal' show={show} onHide={handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>Как это работает?!</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<p>Сначала выбирается категория с Википедии, например, категория - <a href='https://ru.wikipedia.org/wiki/Категория:Животные_по_алфавиту' target='_blank'>животные по алфавиту</a>, страницы, входящие в которую будут анализироваться дальше, и максимальное количество страниц.
						</p>
						<p>Затем считывается содержимое каждой страницы по очереди в выбранной категории.</p>
						<p>Потом содержимое разбивается на токены (слова).</p>
						<p>Делаются морфологические преобразования, чтобы объединить слова с разными окончаниями и привести их к начальной форме (австралийский, австралийская).</p>
						<p>Исключаются из полученной выборки нерелевантные слова (предлоги, союзы, местоимения и т.д.).</p>
						<p>Отображается результат в виде таблички.</p>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="primary" onClick={handleClose}>
							Понятно
						</Button>
					</Modal.Footer>
					</Modal>
			  	</>
			);
		}

        return (
            !this.props.loading ? <HowItWorks hasItems={this.props.hasItems}/> : ''
        )
    }
}
