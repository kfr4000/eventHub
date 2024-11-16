// frontend/src/utils/api.js

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// 이벤트 목록 가져오기
export const fetchEvents = async () => {
  try {
    const response = await axios.get(`${API_URL}/events`);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Failed to fetch events');
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
    console.error('Error:', error);
    throw new Error(error.response?.data?.message || 'Failed to register user');
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
    console.error('Error:', error);
    throw new Error(error.response?.data?.message || 'Failed to login');
  }
};

// JWT 토큰이 필요한 요청에 대한 함수들
const setAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (token) {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // 인증된 사용자 토큰
    };
  }
  return { 'Content-Type': 'application/json' };
};

// 이벤트 생성 API 호출
export const createEvent = async (eventData) => {
  try {
    const headers = setAuthHeader();
    const response = await axios.post(`${API_URL}/events`, eventData, { headers });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw new Error(error.response?.data?.message || 'Failed to create event');
  }
};

// 이벤트 참가 API 호출
export const joinEvent = async (eventId) => {
  try {
    const headers = setAuthHeader();
    const response = await axios.post(`${API_URL}/events/${eventId}/join`, {}, { headers });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw new Error(error.response?.data?.message || 'Failed to join event');
  }
};

// 이벤트 삭제 API
export const deleteEvent = async (id) => {
  try {
    const headers = setAuthHeader();
    const response = await axios.delete(`${API_URL}/events/${id}`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete event');
  }
};

// 사용자 주최 이벤트 목록 조회 API 호출
export const getUserHostedEvents = async () => {
  try {
    const headers = setAuthHeader();
    const response = await axios.get(`${API_URL}/events/user/hosted`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch hosted events');
  }
};

// 사용자 참가 이벤트 목록 조회 API 호출
export const getUserJoinedEvents = async () => {
  try {
    const headers = setAuthHeader();
    const response = await axios.get(`${API_URL}/events/user/joined`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch joined events');
  }
};
