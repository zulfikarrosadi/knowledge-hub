import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useRef, useState } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Card, CardContent, CardTitle, CardHeader, CardFooter } from "~/components/ui/card"
import { Link } from "react-router"
import { ArrowLeft, Loader2, User2 } from "lucide-react"
import { toast } from "sonner"
import { useWebSocket, WebSocketReadyState, type JoinStatus, type Payload, } from './use-websocket';
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from "~/components/ui/item"
import { createDownloadedContent, getAllContent, type FileContent } from "~/lib/opfs"
import { useFilesContext } from "~/lib/context/files-context"

const formSchema = z.object({
  code: z
    .string({ error: 'code must be valid string' })
    .min(1, 'code is required')
    .max(6, 'maximum code length is 6')
})

const API_BASE_V1 = 'http://localhost:3000/v1'
const WS_BASE = 'ws://localhost:3000/v1'

export function App() {
  const attemptToConnect = useRef(false)
  const [isLoading, setIsLoading] = useState(false)
  const {
    connect,
    disconnect,
    newRoomMembers,
    userInfo,
    sendMessage,
    readyState,
    joinStatus,
    lastMessage,
    roomFiles,
  } = useWebSocket();
  const { files } = useFilesContext()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
    }
  })

  // This useEffect reacts to connection status changes
  useEffect(() => {
    if (readyState === WebSocketReadyState.OPEN) {
      toast.success("Connected to the room!");
    }
    if (readyState === WebSocketReadyState.CLOSED) {
      if (attemptToConnect.current) {
        toast.info("Disconnected from the room.");
      }
    }
    console.table({ readyState, lastMessage, userInfo })
  }, [readyState]);

  async function handleJoinRoom(values: z.infer<typeof formSchema>) {
    console.log('handle join triggered: ', values.code)
    setIsLoading(true);
    attemptToConnect.current = true;
    connect(`${API_BASE_V1}/rooms/${values.code}`);
    setIsLoading(false);
  }

  function handleCreateRoom() {
    setIsLoading(true);
    attemptToConnect.current = true;
    connect(`${WS_BASE}/rooms`);
    setIsLoading(false);
  }

  function handleDisconnect() {
    disconnect()
  }

  function updateJoinStatus(status: JoinStatus, username: string) {
    if (!userInfo) {
      return
    }
    sendMessage({
      type: 'join-room-status',
      join_status: status,
      data: null,
      user: {
        username: username,
        room_id: userInfo.roomId,
        is_owner: userInfo.isOwner,
      }
    })
  }

  async function handleSharing() {
    if (!userInfo || !joinStatus) {
      return
    }

    const filesContent = await getAllContent(files)

    const data: Payload = {
      type: 'sync-notes',
      join_status: joinStatus,
      data: filesContent,
      user: {
        username: userInfo.username,
        room_id: userInfo.roomId,
        is_owner: userInfo.isOwner,
      },
    }
    sendMessage(data)
  }

  function handleDownload(data: FileContent[], username: string) {
    createDownloadedContent(data, username)
    toast.info('File downloaded. Creating the file may take a while')
  }

  return (
    <section className="min-h-screen w-full bg-gray-50 p-4 sm:p-8 flex items-center justify-center font-sans">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
        <Card className={`w-full rounded-2xl shadow-lg ${userInfo ? 'lg:col-span-2' : 'lg:col-span-3 lg:col-start-2'}`}>
          <CardHeader>
            <Link to={'/editor'} className="text-sm underline flex gap-2 items-center">
              <ArrowLeft />
              <span>Back to editor</span>
            </Link>
            <h1 className="text-3xl text-center">Share your files to other device</h1>
          </CardHeader>
          <CardContent>
            {readyState === WebSocketReadyState.OPEN && userInfo && userInfo.roomId ?
              <>
                <div className="space-y-4 flex flex-col items-center">
                  <h2 className="text-center text-gray-800">
                    Your sharing code is <code className="font-mono bg-gray-100 text-black p-1 rounded-md">{userInfo.roomId}</code>
                    <br />
                    Your username <span className="font-semibold">{userInfo.username}</span>
                  </h2>
                  {userInfo.isOwner ?
                    <>
                      <p className="text-sm text-gray-600">You're the room owner</p>
                      {newRoomMembers.map((member) => {
                        return (
                          <Item variant='outline' key={member.username}>
                            <ItemMedia>
                              <User2 />
                            </ItemMedia>
                            <ItemContent>
                              <ItemTitle>{member.username}</ItemTitle>
                            </ItemContent>
                            <ItemActions>
                              <Button
                                size='sm'
                                onClick={() => updateJoinStatus('approved', member.username)}
                                variant='outline'
                              >
                                Accept
                              </Button>
                              <Button
                                size='sm'
                                onClick={() => updateJoinStatus('rejected', member.username)}
                                variant='destructive'
                              >
                                Reject
                              </Button>
                            </ItemActions>
                          </Item>
                        )
                      })}
                    </>
                    :
                    null
                  }
                  {joinStatus && joinStatus === 'pending' &&
                    <div className="flex flex-col items-center gap-2 pt-4">
                      <p className="text-sm text-gray-600">Waiting for room owner to accept...</p>
                      <Loader2 className="animate-spin" />
                    </div>
                  }
                </div>
              </>
              :
              <>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleJoinRoom)}
                    className="space-y-4 mt-5 text-center"
                  >
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sharing Code</FormLabel>
                          <FormControl>
                            <Input placeholder="123456" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full cursor-pointer"
                      disabled={isLoading}
                    >
                      Enter Code
                    </Button>
                    <div className="flex items-center gap-2 my-4">
                      <div className="flex-1 border-t border-gray-200"></div>
                      <p className="text-sm text-gray-500">Or</p>
                      <div className="flex-1 border-t border-gray-200"></div>
                    </div>
                  </form>
                </Form>
                <Button
                  onClick={() => handleCreateRoom()}
                  disabled={isLoading}
                  className="w-full cursor-pointer"
                  variant="secondary"
                >
                  Create Code
                </Button>
              </>
            }
          </CardContent>
          {WebSocketReadyState.OPEN && userInfo &&
            <CardFooter>
              <Button
                className="w-full cursor-pointer"
                onClick={() => handleDisconnect()}
              >
                Disconnect and leave room
              </Button>
            </CardFooter>
          }
        </Card>
        {userInfo &&
          <Card className="w-full rounded-2xl shadow-lg lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-semibold">Share Your Knowledge Know</CardTitle>
              <Button
                onClick={() => handleSharing()}
                className="cursor-pointer"
              >Share</Button>
            </CardHeader>
            <CardContent>
              <div className="w-full space-y-2">
                {roomFiles.map((file) => (
                  <Item key={file.user.username} variant="outline">
                    <ItemMedia>
                      <User2 />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{file.user.username}</ItemTitle>
                    </ItemContent>
                    <ItemActions>
                      <Button
                        size='sm'
                        onClick={() => handleDownload(file.data, file.user.username)}
                        variant='outline'
                        className="cursor-pointer"
                      >
                        Download
                      </Button>
                    </ItemActions>
                  </Item>
                ))}
                {roomFiles.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-8">No files have been shared yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        }
      </div>
    </section>
  )
}
