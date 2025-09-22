import {
  Home,
  Edit3,
  ChevronDown,
  ChevronUp,
  MenuSquare,
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
import { getAllFiles } from "~/lib/opfs"
import { useEffect, useMemo, useRef, useState } from "react"
import CreateFolderDialog from "./create-folder-dialog"
import { useFilesContext } from "~/lib/context/files-context"
import { FileTreeNode, type TreeNode } from "~/components/file-tree-node"

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


// --- Helper function to build the tree ---
function buildFileTree(files: ReturnType<typeof useFilesContext>['files']): TreeNode[] {
  const tree: TreeNode[] = [];
  const nodeMap = new Map<string, TreeNode>();

  // Sort files by path depth to ensure parents are created before children
  const sortedFiles = [...files].sort((a, b) => a.relativePath.localeCompare(b.relativePath)).sort((a, b) => a.kind.localeCompare(b.kind));

  // First pass: create all nodes and map them by their path
  sortedFiles.forEach(file => {
    const newNode: TreeNode = {
      ...file,
      children: [],
    };
    nodeMap.set(file.relativePath, newNode);
  });

  // Second pass: link nodes to their parents
  nodeMap.forEach(node => {
    const parentPath = node.relativePath.substring(0, node.relativePath.lastIndexOf('/'));
    if (parentPath && nodeMap.has(parentPath)) {
      const parent = nodeMap.get(parentPath);
      parent?.children.push(node);
    } else {
      // No parent found, so it's a root node
      tree.push(node);
    }
  });

  return tree;
}

export function AppSidebar() {
  const filesContext = useFilesContext()
  const hasFetched = useRef(false)
  const [searchTerm, setSearchTerm] = useState("");
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(true)
  const [isCreateFileOpen, setIsCreateFileOpen] = useState(true)
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(true)

  useEffect(() => {
    if (!hasFetched.current) {
      async function initializeFileSystem() {
        const files = await getAllFiles()
        filesContext.setFiles(files);
      }
      initializeFileSystem()
      hasFetched.current = true
    }
  }, [])

  useEffect(() => {
    console.log(filesContext.files)
  }, [filesContext.files])

  const fileTree = useMemo(() => {
    const filtered = filesContext.files.filter(file =>
      file.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // If searching, we show a flat list. Otherwise, show the tree.
    if (searchTerm) {
      return buildFileTree(filtered);
    }

    return buildFileTree(filesContext.files);
  }, [filesContext.files, searchTerm]);

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <Collapsible open={isCollapsibleOpen} defaultOpen={true} onOpenChange={setIsCollapsibleOpen}>
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger asChild className="w-full">
                <div className="w-full flex justify-between items-center gap-2">
                  <span>Project</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform ${isCollapsibleOpen ? 'rotate-180' : ''}`}
                  />
                </div>
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem className="flex gap-2 p-2">
                    <Input
                      placeholder="Search files..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <CreateFileDialog
                      parentFolder=""
                      open={isCreateFileOpen}
                      setOpen={setIsCreateFileOpen}
                    />
                    <CreateFolderDialog
                      relativePath=""
                      open={isCreateFolderOpen}
                      setOpen={setIsCreateFolderOpen}
                    />
                  </SidebarMenuItem>
                  {fileTree.map((node) => (
                    <FileTreeNode key={node.relativePath} node={node} />
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

