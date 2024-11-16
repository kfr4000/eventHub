// frontend/src/utils/api.js

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// 에러 처리 함수
const handleApiError = (error, defaultMessage) => {
  console.error('Error:', error);
  return new Error(error.response?.data?.message || defaultMessage);
};

// 이벤트 목록 가져오기
export const fetchEvents = async () => {
  try {
    const response = await axios.get(`${API_URL}/events`);
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Failed to fetch events');
  }
};

// 특정 이벤트 가져오기 (Event Detail)
export const fetchEvent = async (eventId) => {
  try {
    const response = await axios.get(`${API_URL}/events/${eventId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Failed to fetch event details');
  }
};

// 회원가입
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users/register`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Failed to register user');
  }
};

// 로그인
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Failed to login');
  }
};

// JWT 토큰이 필요한 요청에 대한 함수들
const setAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    if (decodedToken.exp < currentTime) {
      localStorage.removeItem('token'); // 토큰이 만료되었으면 제거
      window.location.href = '/login'; // 로그인 페이지로 이동
      throw new Error('Session expired, please log in again');
    }

    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // 인증된 사용자 토큰
    };
  }
  throw new Error('No authentication token found');
};

// 이벤트 생성 API 호출
export const createEvent = async (eventData) => {
  try {
    const headers = setAuthHeader();
    const response = await axios.post(`${API_URL}/events`, eventData, { headers });
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Failed to create event');
  }
};

// 이벤트 참가 API 호출
export const joinEvent = async (eventId) => {
  try {
    const headers = setAuthHeader();
    const response = await axios.post(`${API_URL}/events/${eventId}/join`, {}, { headers });
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Failed to join event');
  }
};

// 이벤트 삭제 API
export const deleteEvent = async (id) => {
  try {
    const headers = setAuthHeader();
    const response = await axios.delete(`${API_URL}/events/${id}`, { headers });
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Failed to delete event');
  }
};

// 사용자 주최 이벤트 목록 조회 API 호출
export const getUserHostedEvents = async () => {
  try {
    const headers = setAuthHeader();
    const response = await axios.get(`${API_URL}/events/user/hosted`, { headers });
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Failed to fetch hosted events');
  }
};

// 사용자 참가 이벤트 목록 조회 API 호출
export const getUserJoinedEvents = async () => {
  try {
    const headers = setAuthHeader();
    const response = await axios.get(`${API_URL}/events/user/joined`, { headers });
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Failed to fetch joined events');
  }
};
