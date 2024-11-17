// frontend/src/utils/api.js

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// 에러 처리 함수
const handleApiError = (error, defaultMessage) => {
  console.error('API Error:', error.response || error.message);
  if (error.response && error.response.data) {
    console.error('Error response data:', error.response.data); // 에러 데이터 로그
  }
  return new Error(error.response?.data?.message || defaultMessage);
};

// JWT 토큰이 필요한 요청에 대한 함수들
const setAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const decodedToken = JSON.parse(atob(token.split('.')[1]));
  const currentTime = Math.floor(Date.now() / 1000);

  if (decodedToken.exp < currentTime) {
    localStorage.removeItem('token'); // 토큰이 만료되었으면 제거
    throw new Error('Session expired, please log in again');
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`, // 인증된 사용자 토큰
  };
};

// 사용자 회원가입
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users/register`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    localStorage.setItem('token', response.data.token); // 회원가입 성공 시 토큰 저장
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
    localStorage.setItem('token', response.data.token); // 로그인 성공 시 토큰 저장
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Failed to login');
  }
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

// 전체 이벤트 목록 조회 API 호출
export const fetchEvents = async () => {
  try {
    const response = await axios.get(`${API_URL}/events`);
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Failed to fetch events');
  }
};
