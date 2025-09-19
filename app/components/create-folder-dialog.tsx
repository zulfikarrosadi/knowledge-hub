import { Folder } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { z } from 'zod'
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { createFile, createFolder, getAllFile } from "~/lib/create-file"
import { useFileContext } from "~/lib/context/files-context"
import { useState, type Dispatch, type SetStateAction } from "react"

const formSchema = z.object({
  foldername: z
    .string({ error: 'folder name must be a valid string' })
    .min(1, 'folder name is required')
    .max(50, 'folder name should be less than 50 characters'),
})

export function CreateFolderForm({ setOpen }: { setOpen: Dispatch<SetStateAction<boolean>> }) {
  const fileContext = useFileContext()
  const [isCreating, setIsCreating] = useState(false)


  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      foldername: ''
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsCreating((prev) => prev = true)
    await createFolder(values.foldername, 'notes')
    const allFiles = await getAllFile()

    const files = Object.keys(allFiles).map(key => {
      return {
        name: allFiles[key].name,
        relativePath: allFiles[key].relativePath,
        size: allFiles[key].size,
        kind: allFiles[key].kind,
        type: allFiles[key].type,
        handle: allFiles[key].handle,
        lastModified: allFiles[key].lastModified,
      }
    }).sort((a, b) => a.lastModified - b.lastModified)
      .sort((a, b) => a.kind.localeCompare(b.kind))

    fileContext.setFiles(files);
    setOpen(false)
    setIsCreating((prev) => prev = false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="foldername"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Folder Name</FormLabel>
              <FormControl>
                <Input placeholder="My folder" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isCreating}>
          Create Folder
        </Button>
      </form>
    </Form>
  )
}

export default function() {
  const [open, setOpen] = useState(false)
  const handleOpenChange = (newOpenState: boolean) => {
    setOpen(newOpenState);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant='outline'>
          <Folder />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Craete Folder</DialogTitle>
          <DialogDescription>
            Create folder to organize your notes
          </DialogDescription>
        </DialogHeader>
        <CreateFolderForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  )
}
