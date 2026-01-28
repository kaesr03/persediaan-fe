import { useRouteError } from 'react-router-dom';
import LinkButton from './LinkButton';

function Error() {
  const error = useRouteError();
  console.log(error);

  let title = 'Terjadi Error!';
  let message = 'Something went wrong!';

  if (error.status === 404) {
    title = 'Not Found || 404';
    message = 'Tidak dapat menemukan resource atau halaman';
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-gray-600">{error.message || message}</p>

      <LinkButton to="-1" className="mt-4 text-blue-600 hover:underline">
        &larr; Go back
      </LinkButton>
    </div>
  );
}

export default Error;
