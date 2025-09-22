import type { Route } from "./+types/editor";
import App from "pages/editor";
import {
  SidebarProvider,
  SidebarTrigger
} from '~/components/ui/sidebar';
import { AppSidebar } from '~/components/app-sidebar';

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Markdown Editor" },
    { name: "description", content: "Create your very own notes using markdown" },
  ];
}

export default function Editor({ params }: Route.ComponentProps) {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <div className='flex justify-content-center align-items-center h-[32px] p-[6px]'>
          <SidebarTrigger />
        </div>
        <App params={params} />
      </SidebarProvider>

    </>
  )
}
