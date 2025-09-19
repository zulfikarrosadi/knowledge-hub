export async function createFile(filename: string, foldername: string | null = null) {
  const opsfRoot = await navigator.storage.getDirectory()

  if (foldername) {
    const folder = await opsfRoot.getDirectoryHandle(foldername, { create: true })
    const filehandle = await folder.getFileHandle(filename, { create: true })
    return filehandle
  }

  const notes = await opsfRoot.getDirectoryHandle('notes', { create: true })
  const filehandle = await notes.getFileHandle(filename, { create: true })

  return filehandle
}

export async function createFolder(foldername: string, parentfolder: string | null = null) {
  const root = await navigator.storage.getDirectory()
  if (parentfolder) {
    const parent = await root.getDirectoryHandle(parentfolder)
    const newFolder = await parent.getDirectoryHandle(foldername, { create: true })

    return newFolder
  }
  const folderHandle = await root.getDirectoryHandle(foldername, { create: true })

  return folderHandle
}


export type FileSystemItem = {
  handle: FileSystemHandle;
  kind: 'file' | 'directory';
  name: string;
  relativePath: string;
  lastModified: number;
  size: number;
  type: string;
};

/**
 * Recursively retrieves all file and directory entries from a given
 * directory handle and returns them as a flat array.
 *
 * @param directoryHandle The handle to the directory to scan.
 * @param parentPath The path of the parent directory, used for recursion.
 * @returns A promise that resolves to a flat array of all entries.
 */
export const getDirectoryEntriesRecursive = async (
  directoryHandle: FileSystemDirectoryHandle,
  parentPath = '',
): Promise<FileSystemItem[]> => {
  let entries: FileSystemItem[] = [];

  for await (const handle of directoryHandle.values()) {
    // Construct the full relative path for the current item
    const relativePath = parentPath ? `${parentPath}/${handle.name}` : handle.name;

    if (handle.kind === 'file') {
      const file = await handle.getFile();
      entries.push({
        name: handle.name,
        kind: handle.kind,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        relativePath: relativePath,
        handle,
      });
    } else if (handle.kind === 'directory') {
      // Add the directory entry itself
      entries.push({
        name: handle.name,
        kind: handle.kind,
        relativePath: relativePath,
        handle,
        // Provide sensible defaults for directory-specific fields
        size: 0,
        type: 'directory',
        lastModified: 0,
      });

      // Recurse into the subdirectory and add its children to the list
      const children = await getDirectoryEntriesRecursive(handle, relativePath);
      entries = entries.concat(children);
    }
  }

  return entries;
};


/**
 * Gets all file and directory items from the 'notes' directory in OPFS.
 * "notes" is root folder for this project
 * @returns A promise that resolves to a flat array of all items.
 */
export async function getAllFiles() {
  const opfsRoot = await navigator.storage.getDirectory();
  const dirHandle = await opfsRoot.getDirectoryHandle('notes', { create: true });
  const allFiles = await getDirectoryEntriesRecursive(dirHandle);
  return allFiles;
}
export async function getContent(filename: string) {
  const opsfRoot = await navigator.storage.getDirectory()
  const notes = await opsfRoot.getDirectoryHandle('notes')

  const filehandle = await notes.getFileHandle(filename)

  const file = await filehandle.getFile()
  return await file.text()
}
