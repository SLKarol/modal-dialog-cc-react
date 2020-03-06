import React, { Component, Fragment } from 'react';
import Modal from './ModalDialogCC/ModalDialogCC';
import './App.css';

class App extends Component {
  state = {
    showModal: false,
    height: 296,
    width: 445,
    minWidth: 0,
    minHeight: 0,
    closeOnEsc: true,
    canResize: true
  };

  /**
   * Показать/Спрятать модалку
   */
  toggleModal = () => {
    this.setState(state => {
      return { showModal: !state.showModal };
    });
  };

  /**
   * Изменение параметров модального окна
   */
  handlerChangeModalProp = e => {
    const { id, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    this.setState({ [id]: newValue });
  };

  render() {
    return (
      <Fragment>
        <div className='app_settings'>
          <div className='app__parameter'>
            <label className='app__label' htmlFor='height'>
              Высота модального окна
            </label>
            <input
              type='number'
              id='height'
              className='app__input'
              onChange={this.handlerChangeModalProp}
              value={this.state.height}
              tabIndex={1}
            ></input>
          </div>
          <div className='app__parameter'>
            <label className='app__label' htmlFor='height'>
              Ширина модального окна
            </label>
            <input
              type='number'
              id='width'
              className='app__input'
              onChange={this.handlerChangeModalProp}
              value={this.state.width}
              tabIndex={2}
            ></input>
          </div>
          <div className='app__parameter'>
            <label className='app__label' htmlFor='minHeight'>
              Минимальная высота при ресайзе (0 - расчёт автоматический)
            </label>
            <input
              type='number'
              id='minHeight'
              className='app__input'
              onChange={this.handlerChangeModalProp}
              value={this.state.minHeight}
              tabIndex={3}
            ></input>
          </div>
          <div className='app__parameter'>
            <label className='app__label' htmlFor='minWidth'>
              Минимальная ширина при ресайзе (0 - расчёт автоматический)
            </label>
            <input
              type='number'
              id='minWidth'
              className='app__input'
              onChange={this.handlerChangeModalProp}
              value={this.state.minWidth}
              tabIndex={4}
            ></input>
          </div>
          <div className='app__parameter'>
            <label className='app__label' htmlFor='closeOnEsc'>
              Окно закрыть по Esc?
            </label>
            <input
              type='checkbox'
              id='closeOnEsc'
              onChange={this.handlerChangeModalProp}
              checked={this.state.closeOnEsc}
              tabIndex={5}
            ></input>
          </div>
          <div className='app__parameter'>
            <label className='app__label' htmlFor='canResize'>
              Можно изменять размер?
            </label>
            <input
              type='checkbox'
              id='canResize'
              onChange={this.handlerChangeModalProp}
              checked={this.state.canResize}
              tabIndex={5}
            ></input>
          </div>
          <div className='app__parameter'>
            <button className='app__button' onClick={this.toggleModal}>
              Demo
            </button>
          </div>
        </div>
        {this.state.showModal && (
          <Modal
            onModalClose={this.toggleModal}
            height={this.state.height}
            width={445}
            closeOnEsc={this.state.closeOnEsc}
            minWidth={this.state.minWidth}
            minHeight={this.state.minHeight}
            canResize={this.state.canResize}
          >
            <Modal.Header>Модальное окно</Modal.Header>
            <Modal.Body>Сообщение</Modal.Body>
            <Modal.Footer>
              <button onClick={this.toggleModal}>Закрыть</button>
            </Modal.Footer>
          </Modal>
        )}
      </Fragment>
    );
  }
}

export default App;
