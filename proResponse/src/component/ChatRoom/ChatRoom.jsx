import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchChatRoomDetails } from "../../api/chat/chatApi.js";
import './ChatRoom.css';

const ChatRoom = () => {

    const { id } = useParams();
    const navi = useNavigate();
    const [roomInfo, setRoomInfo] = useState(null);
    const [message, setMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [messages, setMessages] = useState([
        { text: '홍길동 전문가님의 채팅방입니다.', sender: 'other' },
        { text: '안녕하세요. 다음 주 월, 금, 토, 일 중 서비스 받고 싶은데 시간 괜찮을까요?', sender: 'me' },
        { text: '네! 월, 금 저녁 7시 가능합니다!', sender: 'other' }
    ]);
    const wsUrl = `ws://localhost:8080/ws/chat/${id}`;

    const emojis = ['😊', '😂', '❤️', '👍', '🙏', '😍', '🎉', '👏', '🔥', '💯', '😢', '😭', '😅', '🤔', '😎', '🙌', '✨', '💪', '👌', '🤗'];

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

    const handleClose = () => {
        navi(-1); // 이전 페이지로 이동
    };

    const handleSendMessage = () => {
        if (message.trim()) {
            setMessages([...messages, { text: message, sender: 'me' }]);
            setMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleEmojiClick = (emoji) => {
        setMessage(message + emoji);
        setShowEmojiPicker(false);
    };

    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    return (
        <div className="chat-popup-overlay">
            <div className="chat-popup">
                {/* 헤더 */}
                <div className="chat-header">
                    <div>
                        <h2 className="chat-title">채팅하기</h2>
                        <p className="chat-subtitle">채팅으로 서비스 거래해 보세요.</p>
                    </div>
                    <button className="close-button" onClick={handleClose}>✕</button>
                </div>

                {/* 액션 버튼 */}
                <div className="chat-actions">
                    <button className="action-button">
                        <span className="icon">🔔</span>
                        신고하기
                    </button>
                    <button className="action-button">
                        <span className="icon">📝</span>
                        숭급하기
                    </button>
                </div>

                {/* 메시지 영역 */}
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender === 'me' ? 'message-me' : 'message-other'}`}>
                            <div className="message-bubble">
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>

                {/* 입력 영역 */}
                <div className="chat-input-container">
                    {showEmojiPicker && (
                        <div className="emoji-picker">
                            {emojis.map((emoji, index) => (
                                <button
                                    key={index}
                                    className="emoji-item"
                                    onClick={() => handleEmojiClick(emoji)}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    )}
                    <input
                        type="text"
                        className="chat-input"
                        placeholder="메시지를 입력하세요"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button className="emoji-button" onClick={toggleEmojiPicker}>😊</button>
                    <button className="attach-button">📎</button>
                    <button className="send-button" onClick={handleSendMessage}>➤</button>
                </div>
            </div>
        </div>
    );
}

export default ChatRoom;