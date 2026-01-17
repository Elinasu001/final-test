import { API_BASE_URL, createApiInstance } from '../api.js';

const chatApi = createApiInstance(`${API_BASE_URL}/api/rooms`);
const websocketApi = createApiInstance(`${API_BASE_URL}/ws/chat`);


// 1. 채팅방 상세 조회
export const fetchChatRoomDetails = (roomNo) => {
    return websocketApi.get(`/${roomNo}`);
}

