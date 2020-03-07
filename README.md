# ModalDialogCC

Компонент модального окна был написан по статье [How to create an accessible React modal](https://levelup.gitconnected.com/how-to-create-an-accessible-react-modal-5b87e6a27503?ref=heydesigner). Но этот компонент я немного изменил и добавил возможность измененения размера.<br />
Компонент находится в каталоге src/ModalDialogCC , демо - src/App.js и запустить демо можно **npm start**.

## Пример использования:

```javascript
<Modal onModalClose={this.toggleModal} height={400} width={445}>
	<Modal.Header>Модальное окно</Modal.Header>
	<Modal.Body>Сообщение</Modal.Body>
	<Modal.Footer>
		<button onClick={this.toggleModal}>OK</button>
  </Modal.Footer>
</Modal>
```

## Свойства

*onModalClose* - Обработчик закрытия модального окна

*height* - Высота модального окна

*width* - Ширина модального окна

*minHeight* - Минимальная высота, на которую можно изменить размер окна. По умолчанию - треть высоты

*minWidth* - Минимальная ширина, на которую можно изменить размер окна По умолчанию- треть ширины

*closeOnEsc* - Закрывать окно по Esc. По умолчанию true

*canResize* - Молжно изменять размер окна. По умолчанию true

____

The modal window component was written under the article [How to create an accessible React modal](https://levelup.gitconnected.com/how-to-create-an-accessible-react-modal-5b87e6a27503?ref=heydesigner). But I changed this component a bit and added the ability to resize. <br />
The component is located in the src/ModalDialogCC directory, the demo is src/App.js and you can start the demo **npm start**.

## Example:

```javascript
<Modal onModalClose={this.toggleModal} height={400} width={445}>
	<Modal.Header>Модальное окно</Modal.Header>
	<Modal.Body>Сообщение</Modal.Body>
	<Modal.Footer>
		<button onClick={this.toggleModal}>OK</button>
  </Modal.Footer>
</Modal>
```

## Props

*onModalClose* - Modal closing handler

*height* - Modal window height

*width* - Modal window width

*minHeight* - The minimum height by which you can resize the window. The default is one third of the height

*minWidth* - Minimum width by which you can resize the window. Default is one third of the width.

*closeOnEsc* - Close the window by Esc. True by default

*canResize* - You must resize the window. True by default
____

![Скриншот](https://github.com/SLKarol/modal-dialog-cc-react/raw/master/screenshots/screenshot.PNG)
