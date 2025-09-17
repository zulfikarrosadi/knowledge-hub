import {
  SidebarProvider,
  SidebarTrigger
} from '~/components/ui/sidebar';
import { AppSidebar } from '~/components/app-sidebar';
import { Outlet } from 'react-router';

export default function RootLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className='flex justify-content-center align-items-center h-[32px] p-[6px]'>
        <SidebarTrigger />
      </div>
      <Outlet />
    </SidebarProvider>
  )
}
