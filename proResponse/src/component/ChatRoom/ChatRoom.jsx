import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchChatRoomDetails } from "../../api/chat/chatApi.js";
import emojiImg from '../../assets/images/common/emoji.png';
import fileImg from '../../assets/images/common/file.png';
import payImg from '../../assets/images/common/pay.png';
import reportImg from '../../assets/images/common/report.png';
import sendImg from '../../assets/images/common/send.png';

import {
    ActionButton,
    ChatActions,
    ChatBox,
    ChatHeader,
    ChatImage,
    ChatInput,
    ChatInputContainer,
    ChatMessages,
    ChatPopup,
    ChatPopupOverlay,
    ChatSubtitle,
    ChatTitle,
    CloseButton,
    EmojiItem,
    EmojiPicker,
    IconButton,
    Message,
    MessageBubble
} from './ChatRoom.styled.js';

const ChatRoom = () => {

    const { id } = useParams();
    const navi = useNavigate();
    const [roomInfo, setRoomInfo] = useState(null);
    const [message, setMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [messages, setMessages] = useState([
        { text: '홍길동 전문가님의 채팅방입니다.', sender: 'other' },
        { text: '안녕하세요.', sender: 'me' }
    ]);

    const messagesEndRef = useRef(null);
    // Ref for file input
    const fileInputRef = useRef(null);
    // Handle file button click
    const handleFileButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                // 이미지 파일이면 미리보기 URL 생성
                const reader = new FileReader();
                reader.onload = (event) => {
                    setMessages([...messages, { text: '', image: event.target.result, sender: 'me' }]);
                };
                reader.readAsDataURL(file);
            } else {
                setMessages([...messages, { text: `파일 첨부: ${file.name}`, sender: 'me' }]);
            }
        }
        // 같은 파일을 연속 첨부할 수 있도록 value 초기화
        e.target.value = '';
    };
    
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

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
        <ChatPopupOverlay>
            <ChatPopup>
                {/* 헤더 */}
                <ChatHeader>
                    <div>
                        <ChatTitle>채팅하기</ChatTitle>
                        <ChatSubtitle>채팅으로 서비스 거래해 보세요.</ChatSubtitle>
                    </div>
                    <CloseButton onClick={handleClose}>✕</CloseButton>
                </ChatHeader>

                {/* 액션 버튼 */}
                <ChatActions>
                    <ActionButton>
                        <img src={reportImg} alt="report" />
                        신고하기
                    </ActionButton>
                    <ActionButton>
                        <img src={payImg} alt="pay" />
                        송금하기
                    </ActionButton>
                </ChatActions>

                {/* 메시지 영역 */}
                <ChatMessages>
                    {messages.map((msg, index) => (
                        <Message key={index} className={msg.sender === 'me' ? 'message-me' : 'message-other'}>
                            <MessageBubble $sender={msg.sender}>
                                {msg.image ? (
                                    <ChatImage src={msg.image} alt="첨부 이미지" />
                                ) : (
                                    msg.text
                                )}
                            </MessageBubble>
                        </Message>
                    ))}
                    <div ref={messagesEndRef} />
                </ChatMessages>

                {/* 입력 영역 */}
                <ChatInputContainer>
                    {showEmojiPicker && (
                        <EmojiPicker>
                            {emojis.map((emoji, index) => (
                                <EmojiItem
                                    key={index}
                                    onClick={() => handleEmojiClick(emoji)}
                                >
                                    {emoji}
                                </EmojiItem>
                            ))}
                        </EmojiPicker>
                    )}
                    <ChatBox>
                        <ChatInput
                            type="text"
                            placeholder="메시지를 입력하세요"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <IconButton className="emoji-button" onClick={toggleEmojiPicker}>
                            <img src={emojiImg} alt="emoji" />
                        </IconButton>
                        <IconButton className="attach-button" onClick={handleFileButtonClick}>
                            <img src={fileImg} alt="file" />
                        </IconButton>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                        <IconButton className="send-button" onClick={handleSendMessage}>
                            <img src={sendImg} alt="send" />
                        </IconButton>
                    </ChatBox>
                </ChatInputContainer>
            </ChatPopup>
        </ChatPopupOverlay>
    );
}

export default ChatRoom;