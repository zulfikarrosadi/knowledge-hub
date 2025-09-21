import { createContext, useContext, useState, type Dispatch, type JSX, type ReactNode, type SetStateAction } from "react";

type File = {
  name: string;
  handle: FileSystemFileHandle;
  kind: 'file' | 'directory';
  lastModified: number;
  relativePath: string;
  size: number;
  type: string;
}


export const FileContext = createContext<{
  files: File[],
  setFiles: Dispatch<SetStateAction<File[]>>
}>({ files: [], setFiles: () => { } })

export function FileProvider({ children }: { children: JSX.Element | ReactNode }) {
  const [files, setFiles] = useState<File[]>([])

  return (
    <FileContext value={{ files, setFiles }}>
      {children}
    </FileContext>
  )
}

export function useFileContext() {
  return useContext(FileContext)
}
