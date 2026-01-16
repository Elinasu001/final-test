import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchChatRoomDetails } from "../../api/chat/chatApi.js";

const ChatRoom = () => {

    const { id } = useParams();
    const navi = useNavigate();
    const [roomInfo, setRoomInfo] = useState(null);
    const wsUrl = `ws://localhost:8080/ws/chat/${id}`;

    useEffect(() => {
        // 채팅방 상세 정보 불러오기
        fetchChatRoomDetails(id)
            .then((res) =>{
                console.log(res.data.data);
                setRoomInfo(res.data.data);
            })
            .catch((err) => {
                // console.error("채팅방 정보 불러오기 실패:", err);
                const message = err.res.data.message;
                console.log(message);
            })
    }, [id]);

    return (
        <>
            <h2>채팅방 {id}</h2>
            <div>WebSocket URL: {wsUrl}</div>
            {roomInfo ? (
                roomInfo.error ? (
                    <div style={{color: 'red'}}>{roomInfo.error}</div>
                ) : (
                    <pre>{JSON.stringify(roomInfo, null, 2)}</pre>
                )
            ) : (
                <div>채팅방 정보를 불러오는 중...</div>
            )}
        </>
    );
}

export default ChatRoom;