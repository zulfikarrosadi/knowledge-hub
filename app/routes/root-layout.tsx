import { Outlet } from 'react-router';
import { FilesProvider } from '~/lib/context/files-context';

export default function RootLayout() {
  return (
    <FilesProvider>
      <Outlet />
    </FilesProvider>
  )
}
