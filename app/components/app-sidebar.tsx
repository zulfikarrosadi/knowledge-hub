import {
  Home,
  Edit3,
  ChevronDown,
  ChevronUp,
  MenuSquare
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenu,
} from './ui/sidebar'
import { Link } from "react-router"
import { Collapsible } from "./ui/collapsible"
import { CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible"
import { Input } from "./ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import CreateFileDialog from "./create-file-dialog"
import { getAllFile } from "~/lib/create-file"
import { useEffect, useRef } from "react"
import CreateFolderDialog from "./create-folder-dialog"
import { useFileContext } from "~/lib/context/files-context"

const items = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Editor",
    url: "/",
    icon: Edit3,
  },
]

export function AppSidebar() {
  const fileContext = useFileContext()
  const hasFetched = useRef(false)

  useEffect(() => {
    if (!hasFetched.current) {
      async function getAllFiles() {
        const files = await getAllFile()
        const allFiles = Object.keys(files).map(key => {
          return {
            name: files[key].name,
            relativePath: files[key].relativePath,
            size: files[key].size,
            type: files[key].kind,
          }
        })

        fileContext.setFiles(allFiles);
      }
      getAllFiles()
      hasFetched.current = true
    }
  }, [])

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <Collapsible>
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                Project
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem className="flex gap-2">
                    <Input placeholder="Filename" />
                    <div className="flex gap-2">
                      <CreateFileDialog />
                      <CreateFolderDialog />
                    </div>
                  </SidebarMenuItem>
                  {fileContext.files.map((item, index) => (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuButton asChild>
                        <span>{item.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <MenuSquare /> Menu
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
              >
                {items.map(item => (
                  <DropdownMenuItem asChild>
                    <Link to={{ pathname: item.url }}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

