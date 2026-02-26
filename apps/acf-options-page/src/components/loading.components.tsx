export function Loading({ message = 'Loading...', className = '' }) {
  return (
    <div className={`d-flex justify-content-center align-items-center ${className}`}>
      <strong role='status' className='me-5'>
        {message}
      </strong>
      <div className='spinner-border spinner-border-sm' role='status' aria-hidden='true'></div>
    </div>
  );
}

export function LoadingBar() {
  return (
    <div id='loading-strip'>
      <div className='bar'></div>
    </div>
  );
}
