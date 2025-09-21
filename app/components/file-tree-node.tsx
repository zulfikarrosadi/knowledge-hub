import {
  File,
  Folder,
  MoreHorizontal,
  Plus,
  Edit3,
  Trash,
  ChevronDown
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
} from "./ui/sidebar";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import CreateFileDialog from "./create-file-dialog";
import CreateFolderDialog from './create-folder-dialog'

// Define the shape of a single node in our file tree
export type TreeNode = {
  name: string;
  kind: 'file' | 'directory';
  relativePath: string;
  handle: FileSystemHandle;
  children: TreeNode[];
};

type FileTreeNodeProps = {
  node: TreeNode;
};

export function FileTreeNode({ node }: FileTreeNodeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isDirectory = node.kind === 'directory';

  if (isDirectory) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton className="w-full justify-start">
              <div className="flex items-center gap-2">
                <ChevronDown
                  className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
                <Folder className="h-4 w-4" />
                <span>{node.name}</span>
              </div>
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <FileActions item={node} />
        </SidebarMenuItem>
        <CollapsibleContent>
          <div className="pl-6">
            {node.children.length > 0 ? (
              node.children.map((childNode) => (
                <FileTreeNode key={childNode.relativePath} node={childNode} />
              ))
            ) : (
              <p className="p-2 text-xs text-muted-foreground">No files</p>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  // Render a file
  return (
    <SidebarMenuItem className="pl-6">
      <SidebarMenuButton asChild className="w-full justify-start">
        <Link to={`/editor/${encodeURIComponent(node.relativePath)}`} className="flex items-center gap-2">
          <File className="h-4 w-4" />
          <span>{node.name}</span>
        </Link>
      </SidebarMenuButton>
      <FileActions item={node} />
    </SidebarMenuItem>
  );
}


// A helper component for the dropdown actions
function FileActions({ item }: { item: TreeNode }) {
  // TODO: Wire up these functions to the OPFS actions
  const handleRename = () => console.log(`Rename ${item.relativePath}`);
  const handleDelete = () => console.log(`Delete ${item.relativePath}`);

  const [createFileOpen, setCreateFileOpen] = useState(false)
  const [createFolderOpen, setCreateFolderOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction>
            <MoreHorizontal className="h-4 w-4" />
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start">
          {item.kind === 'directory' && (
            <>
              <DropdownMenuItem onSelect={() => setCreateFileOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                <span>Add File</span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setCreateFolderOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                <span>Add Folder</span>
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuItem onClick={handleRename}>
            <Edit3 className="mr-2 h-4 w-4" />
            <span>Rename</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} className="text-red-500">
            <Trash className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CreateFileDialog
        parentFolder={item.relativePath}
        open={createFileOpen}
        setOpen={setCreateFileOpen}
      />
      <CreateFolderDialog
        relativePath={item.relativePath}
        open={createFolderOpen}
        setOpen={setCreateFolderOpen}
      />
    </>
  );
}

