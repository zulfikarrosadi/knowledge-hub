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

export async function getAllFile() {
  const opsfRoot = await navigator.storage.getDirectory()
  const dirHandle = await opsfRoot.getDirectoryHandle('notes')

  const allFiles = await getDirectoryEntriesRecursive(dirHandle)

  return allFiles
}

const getDirectoryEntriesRecursive = async (
  directoryHandle: FileSystemDirectoryHandle,
  relativePath = '.',
): Promise<Record<string, { handle: FileSystemFileHandle, kind: string, lastModified: number, name: string, relativePath: string, size: number, type: string }>> => {
  const fileHandles = [];
  const directoryHandles = [];
  const entries = {};
  const directoryIterator = directoryHandle.values();
  const directoryEntryPromises = [];
  for await (const handle of directoryIterator) {
    const nestedPath = `${relativePath}/${handle.name}`;
    if (handle.kind === 'file') {
      fileHandles.push({ handle, nestedPath });
      directoryEntryPromises.push(
        handle.getFile().then((file) => {
          return {
            name: handle.name,
            kind: handle.kind,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            relativePath: nestedPath,
            handle
          };
        }),
      );
    } else if (handle.kind === 'directory') {
      directoryHandles.push({ handle, nestedPath });
      directoryEntryPromises.push(
        (async () => {
          return {
            name: handle.name,
            kind: handle.kind,
            relativePath: nestedPath,
            entries:
              await getDirectoryEntriesRecursive(handle, nestedPath),
            handle,
          };
        })(),
      );
    }
  }
  const directoryEntries = await Promise.all(directoryEntryPromises);
  directoryEntries.forEach((directoryEntry) => {
    entries[directoryEntry.name] = directoryEntry;
  });
  return entries;
};

export async function getContent(filename: string) {
  const opsfRoot = await navigator.storage.getDirectory()
  const notes = await opsfRoot.getDirectoryHandle('notes')

  const filehandle = await notes.getFileHandle(filename)

  const file = await filehandle.getFile()
  return await file.text()
}
