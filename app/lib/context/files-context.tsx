import { createContext, useContext, useState, type Dispatch, type JSX, type ReactNode, type SetStateAction } from "react";

export type FileEntry = {
  name: string;
  handle: FileSystemFileHandle;
  kind: 'file';
  lastModified: number;
  relativePath: string;
  size: number;
  type: string;
}
type DirectoryEntry = {
  name: string;
  handle: FileSystemDirectoryHandle;
  kind: 'directory';
  lastModified: number;
  relativePath: string;
  size: number;
  type: string;
}

type File = FileEntry | DirectoryEntry

export const FilesContext = createContext<{
  files: File[],
  setFiles: Dispatch<SetStateAction<File[]>>,
}>({
  files: [],
  setFiles: () => { },
})

export function FilesProvider({ children }: { children: JSX.Element | ReactNode }) {
  const [files, setFiles] = useState<File[]>([])

  return (
    <FilesContext value={{ files, setFiles }}>
      {children}
    </FilesContext>
  )
}

export function useFilesContext() {
  return useContext(FilesContext)
}
