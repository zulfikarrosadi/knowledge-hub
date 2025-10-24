import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export enum WebSocketReadyState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

export type JoinStatus = 'approved' | 'pending' | 'rejected' | 'success' | 'fail';
export type PayloadType = 'sync-notes' | 'join-room-status' | 'create-room' | 'join-room' | 'receive-data'
export type Payload = {
  type: PayloadType;
  join_status: JoinStatus;
  data: any;
  user: {
    username: string;
    room_id: string;
    is_owner: boolean;
  }
}

export type RoomData = {
  data: any;
  user: {
    username: string;
    room_id: string;
  }
}

type UserInfo = {
  roomId: string;
  username: string;
  isOwner: boolean;
}
type NewRoomMember = {
  username: string;
  roomId: string
}

export function useWebSocket() {
  const [readyState, setReadyState] = useState<WebSocketReadyState>(WebSocketReadyState.CLOSED)
  const [lastMessage, setLastMessage] = useState<Payload | null>(null)
  const [joinStatus, setJoinStatus] = useState<JoinStatus | undefined>(undefined)
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>(undefined)
  const [newRoomMembers, setNewRoomMembers] = useState<NewRoomMember[]>([])
  const [roomFiles, setRoomFiles] = useState<RoomData[]>([])
  const ws = useRef<WebSocket | null>(null)

  useEffect(() => {
    return () => {
      ws.current?.close()
      setLastMessage(null);
      setJoinStatus(undefined);
      setUserInfo(undefined);
      setNewRoomMembers([]);
      setRoomFiles([]);
    }
  }, [])

  useEffect(() => {
    console.log('last message effect triggered: ', lastMessage)
    if (!lastMessage) {
      return
    }
    // set info if it is the first time connect
    if (lastMessage.type === 'create-room' && !userInfo) {
      setJoinStatus(lastMessage.join_status)
      setUserInfo({ roomId: lastMessage.user.room_id, username: lastMessage.user.username, isOwner: lastMessage.user.is_owner })
    }

    // set info for join but if the userInfo already filled, then skipped
    if (lastMessage.type === 'join-room') {
      setNewRoomMembers((prev) => {
        return [
          ...prev,
          {
            username: lastMessage.user.username,
            roomId: lastMessage.user.room_id
          }
        ]
      })
      if (userInfo) {
        return
      }
      setJoinStatus(lastMessage.join_status)
      setUserInfo({
        roomId: lastMessage.user.room_id,
        username: lastMessage.user.username,
        isOwner: lastMessage.user.is_owner
      })
    }

    if (lastMessage.type === 'join-room-status') {
      console.log('join room status ops: ', lastMessage)
      const roomMembers = newRoomMembers.filter((member) => {
        return member.username !== lastMessage.user.username
      })
      console.log('after filtering: ', roomMembers)
      setNewRoomMembers(roomMembers)

      if (userInfo && lastMessage.user.username === userInfo.username) {
        setJoinStatus(lastMessage.join_status)
      }
    }
    if (lastMessage.type === 'sync-notes') {
      console.log('sync notes ops: ', lastMessage)
      setRoomFiles((prev) => [...prev, lastMessage])
    }
  }, [lastMessage])

  useEffect(() => {
    if (!ws.current) {
      return
    }

    if (joinStatus === 'rejected') {
      ws.current.close()
    }
  }, [joinStatus])

  const connect = useCallback((url: string) => {
    if (ws.current && ws.current.readyState < WebSocketReadyState.CLOSING) {
      console.warn("WebSocket is already connected or connecting.");
      return;
    }

    // Create a new WebSocket instance
    const socket = new WebSocket(url);
    ws.current = socket;

    setReadyState(WebSocketReadyState.CONNECTING);

    socket.onopen = (event) => {
      console.log('WebSocket connection opened:', event);
      setReadyState(WebSocketReadyState.OPEN);
    };

    socket.onmessage = (event) => {
      console.log('Received message:', event.data);
      setLastMessage(JSON.parse(event.data))
    };

    socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
      setReadyState(WebSocketReadyState.CLOSED);
      setUserInfo(undefined)
      setNewRoomMembers([])
      ws.current = null; // Clear the ref on close
    };

    socket.onerror = (event) => {
      toast.error('Something went wrong, please try again later')
      console.error('WebSocket error:', event);
      // The 'onclose' event will usually follow an error
      setReadyState(WebSocketReadyState.CLOSED);
    };
  }, [])


  const sendMessage = useCallback((data: Payload) => {
    if (ws.current?.readyState === WebSocketReadyState.OPEN) {
      ws.current.send(JSON.stringify(data))
    } else {
      console.error('Cannot send message, WebSocket is not open.');
    }
  }, []);

  const disconnect = useCallback(() => {
    ws.current?.close();
    setLastMessage(null);
    setJoinStatus(undefined);
    setUserInfo(undefined);
    setNewRoomMembers([]);
    setRoomFiles([]);
  }, []);

  return {
    connect,
    disconnect,
    lastMessage,
    sendMessage,
    userInfo,
    joinStatus,
    newRoomMembers,
    readyState,
    roomFiles,
  };
}

