import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useReducer
} from 'react';
import { createPortal } from 'react-dom';
import './ModalDialogCC.css';

const modalContext = createContext();
// https://levelup.gitconnected.com/how-to-create-an-accessible-react-modal-5b87e6a27503?ref=heydesigner
export default function Modal({
  children,
  onModalClose,
  height,
  width,
  closeOnEsc = true,
  minWidth = 0,
  minHeight = 0,
  canResize = true,
  handlerStopResize,
  handlerStartResize,
  className = 'modal-content-default'
}) {
  const modalRef = useRef(null);
  const dialogRef = useRef(null);
  const initialState = {
    style: {
      width: ('' + width).includes('%') ? width : width + 'px',
      height: ('' + height).includes('%') ? height : height + 'px'
    },
    isMoving: false,
    deltaCoords: { deltaLeft: null, deltaTop: null },
    isResizing: false,
    originalMetrics: { width, height, mouse_x: 0, mouse_y: 0 },
    // По умолчанию поставлю минимальный размер 2/3 от заданного
    minSize: {
      width: minWidth ? minWidth : parseInt((2 * width) / 3, 10),
      height: minHeight ? minHeight : parseInt((2 * height) / 3, 10)
    }
  };
  const [stateModal, dispatchInModal] = useReducer(reducerModal, initialState);
  //--- Повесить обработчик события на нажатия клавиш
  useEffect(() => {
    function keyListener(e) {
      const listener = keyListenersMap.get(e.keyCode);
      return listener && listener(e);
    }

    document.addEventListener('keydown', keyListener);
    return () => {
      document.removeEventListener('keydown', keyListener);
    };
  });
  //--- Повесить обработчик на движение мыши
  useEffect(() => {
    //--- Нужно быть 100% уверенным, что фокус получится
    const { current } = dialogRef;

    if (!current) return;
    current.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', setStopResize);

    //--- "Чистим" обработчики
    return () => {
      if (current) {
        current.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', setStopResize);
      }
    };
  });

  //--- Включить перемещение окна
  const setCanMoving = e => {
    if (e.target.tagName === 'DIV') {
      const deltaCoords = {
        deltaLeft: e.pageX - modalRef.current.offsetLeft,
        deltaTop: e.pageY - modalRef.current.offsetTop
      };
      dispatchInModal({ type: 'startMoving', payload: { deltaCoords } });
    }
  };
  //--- Выключить перемещение окна
  const setCanNotMoving = () => {
    dispatchInModal({ type: 'stopMoving' });
  };

  //--- Handler перемещения (Да, Стас не знает 100% английского)
  const onMouseMove = e => {
    const { isMoving, isResizing } = stateModal;
    if (isMoving) {
      handlerMoveDialog(e);
    }
    if (isResizing) {
      handlerResizeDialog(e);
    }
  };

  const keyListenersMap = closeOnEsc
    ? new Map([[27, onModalClose]])
    : new Map([]); // , [9, handleTabKey]
  //--- Применение ширины-высоты (Сложные вычисления обусловлены тем, что могут задать в % а не в px

  const setCanResize = e => {
    // Снимем метрику с объекта
    if (canResize) {
      const originalMetrics = {};
      originalMetrics.width = modalRef.current.offsetWidth;
      originalMetrics.height = modalRef.current.offsetHeight;
      originalMetrics.left = modalRef.current.offsetLeft;
      originalMetrics.top = modalRef.current.offsetTop;
      originalMetrics.mouse_x = e.pageX;
      originalMetrics.mouse_y = e.pageY;
      dispatchInModal({
        type: 'startResize',
        payload: { originalMetrics, handlerStartResize }
      });
      e.preventDefault();
    }
  };

  const setStopResize = e => {
    if (canResize) {
      const { clientHeight, clientWidth } = modalRef.current;
      dispatchInModal({
        type: 'stopResize',
        payload: {
          handlerStopResize,
          height: clientHeight,
          width: clientWidth
        }
      });
      e.preventDefault();
    }
  };

  const handlerMoveDialog = e => {
    const { deltaCoords } = stateModal;
    const newTop = e.pageY - deltaCoords.deltaTop;
    const newLeft = e.pageX - deltaCoords.deltaLeft;
    if (
      newTop + modalRef.current.offsetHeight <
        document.documentElement.clientHeight - 20 &&
      newLeft + modalRef.current.offsetWidth <
        document.documentElement.clientWidth - 20
    ) {
      const newCoords = {
        top: `${newTop}px`,
        left: `${newLeft}px`
      };
      dispatchInModal({ type: 'isMoving', payload: { newCoords } });
    }
    e.stopPropagation();
    e.preventDefault();
  };

  const handlerResizeDialog = e => {
    const { originalMetrics, minSize } = stateModal;
    const width = originalMetrics.width + (e.pageX - originalMetrics.mouse_x);
    const height = originalMetrics.height + (e.pageY - originalMetrics.mouse_y);
    if (
      height + modalRef.current.offsetTop <
        document.documentElement.clientHeight - 20 &&
      width + modalRef.current.offsetLeft <
        document.documentElement.clientWidth - 20
    ) {
      const newSize = {};
      newSize.width = width > minSize.width ? width : minSize.width;
      newSize.height = height > minSize.height ? height : minSize.height;
      dispatchInModal({ type: 'newSize', payload: { newSize } });
    }
    e.stopPropagation();
    e.preventDefault();
  };

  const classResiser = canResize ? 'modal__resizer' : 'modal__resizer--hide';

  return createPortal(
    <div
      className='modal-container-default'
      role='dialog'
      aria-modal='true'
      ref={dialogRef}
    >
      <div className={className} ref={modalRef} style={stateModal.style}>
        <modalContext.Provider
          value={{ onModalClose, setCanMoving, setCanNotMoving }}
        >
          {children}
        </modalContext.Provider>
        <div className={classResiser} onMouseDown={setCanResize} />
      </div>
    </div>,
    document.body
  );
}

Modal.Header = function ModalHeader(props) {
  const { className = 'modal-header-default' } = props;
  const { onModalClose, setCanMoving, setCanNotMoving } = useContext(
    modalContext
  );
  const classNameCloseBtn =
    className === 'modal-header-default' ? 'cross-btn' : 'button__close-modal';
  return (
    <div
      className={className}
      onMouseDown={setCanMoving}
      onMouseUp={setCanNotMoving}
      tabIndex='-1'
    >
      {props.children}
      <button
        className={classNameCloseBtn}
        title='Закрыть'
        onClick={() => onModalClose()}
        tabIndex='-1'
      >
        X
      </button>
    </div>
  );
};

Modal.Body = function ModalBody(props) {
  const { className = 'modal-body-default', children } = props;
  return <div className={className}>{children}</div>;
};

Modal.Footer = function ModalFooter(props) {
  const { className = 'modal-footer-default', children } = props;
  return <div className={className}>{children}</div>;
};

Modal.Footer.CloseBtn = function CloseBtn(props) {
  const { onModalClose } = useContext(modalContext);
  return (
    <button
      {...props}
      className='close-btn'
      title='close modal'
      onClick={onModalClose}
    />
  );
};

function reducerModal(state, { type, payload }) {
  const { style } = state;
  switch (type) {
    case 'startMoving':
      const { deltaCoords } = payload;
      return {
        ...state,
        isMoving: true,
        style: { ...style, opacity: 0.7 },
        deltaCoords
      };
    case 'stopMoving':
      const newStyle = Object.assign({}, style);
      delete newStyle.opacity;
      return { ...state, isMoving: false, style: { ...newStyle } };
    case 'isMoving':
      const { newCoords } = payload;
      return { ...state, style: { ...style, ...newCoords } };
    case 'startResize':
      const { originalMetrics, handlerStartResize } = payload;
      if (handlerStartResize) {
        handlerStartResize();
      }
      return { ...state, isResizing: true, originalMetrics };
    case 'stopResize':
      const { handlerStopResize } = payload;
      if (handlerStopResize) {
        handlerStopResize({ height: payload.height, width: payload.width });
      }
      return { ...state, isResizing: false };
    case 'newSize':
      const { newSize } = payload;
      const { width, height } = newSize;
      const { left = '', top = '' } = state['originalMetrics'];
      return {
        ...state,
        style: {
          ...style,
          width: width + 'px',
          height: height + 'px',
          left,
          top
        }
      };
    default:
      throw new Error();
  }
}
