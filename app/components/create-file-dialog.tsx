import { File } from "lucide-react"
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
import { createFile, getAllFiles } from "~/lib/opfs"
import { useFilesContext } from "~/lib/context/files-context"
import { useEffect, useState, type Dispatch, type SetStateAction } from "react"

const formSchema = z.object({
  filename: z
    .string({ error: 'filename must be a valid string' })
    .min(1, 'filename is required')
    .max(50, 'filename should be less than 50 characters'),
  parentFolder: z
    .string()
    .optional()
})

export function CreateFileForm({ setOpen, parentFolder = '' }: { setOpen: Dispatch<SetStateAction<boolean>>, parentFolder: string }) {
  const fileContext = useFilesContext()
  const [isCreating, setIsCreating] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      filename: '',
      parentFolder: parentFolder
    }
  })

  useEffect(() => {
    console.log(parentFolder)
  }, [parentFolder])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsCreating((prev) => prev = true)
    console.log('onsubmit: ', values)

    await createFile(values.filename, values.parentFolder)
    const allFiles = await getAllFiles()
    fileContext.setFiles(allFiles);

    setOpen(false)
    setIsCreating((prev) => prev = false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="filename"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Filename</FormLabel>
              <FormControl>
                <Input placeholder="My amazing note" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="parentFolder"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input hidden={true} {...field} value={parentFolder} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isCreating}>
          Create File
        </Button>
      </form>
    </Form>
  )
}

export default function({ parentFolder = '', open, setOpen }: { parentFolder: string, open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) {
  const handleOpenChange = (newOpenState: boolean) => {
    setOpen(newOpenState);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!parentFolder && (
        <DialogTrigger asChild>
          <Button variant='outline'>
            <File />
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Craete File</DialogTitle>
          <DialogDescription>
            Filename must be unique
          </DialogDescription>
        </DialogHeader>
        <CreateFileForm setOpen={setOpen} parentFolder={parentFolder} />
      </DialogContent>
    </Dialog>
  )
}
