import { Toast } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { hideToast, toastSelector } from '../store/toast.slice';

export const ToastHandler = () => {
  const toasts = useAppSelector(toastSelector);
  const dispatch = useAppDispatch();
  const close = (selected: number) => dispatch(hideToast(selected));

  const darkColors: Array<string> = ['primary', 'secondary', 'success', 'danger', 'dark'];
  return (
    <div className='toast-container position-fixed bottom-0 start-0 p-3'>
      {toasts.map(({ body, header, variant = 'success', delay = 5000, autohide = true, show = true, onClose }, index) => (
        <Toast
          key={index}
          onClose={() => {
            close(index);
            if (onClose) onClose();
          }}
          bg={variant}
          show={show}
          delay={delay}
          className={`${darkColors.includes(variant) && 'text-white'}`}
          autohide={variant === 'danger' ? false : autohide}
        >
          <Toast.Header>
            <strong className='me-auto'>{header}</strong>
          </Toast.Header>
          {body && <Toast.Body>{body}</Toast.Body>}
        </Toast>
      ))}
    </div>
  );
};
ToastHandler.displayName = 'ToastHandler';
