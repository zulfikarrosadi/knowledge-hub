import { Outlet } from 'react-router';
import { FilesProvider } from '~/lib/context/files-context';
import { Toaster } from '~/components/ui/sonner';

export default function RootLayout() {
  return (
    <FilesProvider>
      <Toaster closeButton={true} expand={true} position='top-right' />
      <Outlet />
    </FilesProvider>
  )
}
