// frontend/src/utils/api.js

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// 에러 처리 함수
const handleApiError = (error, defaultMessage) => {
  console.error('Error:', error.response || error.message);
  if (error.response && error.response.data) {
    console.log('Error response data:', error.response.data); // 에러 데이터 로그
  }
  return new Error(error.response?.data?.message || defaultMessage);
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

// 사용자 회원가입
export const registerUser = async (userData) => {
  try {
    console.log('Registering user with data:', userData); // 요청 데이터 로그
    const response = await axios.post(`${API_URL}/users/register`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    localStorage.setItem('token', response.data.token); // 회원가입 성공 시 토큰 저장
    return response.data;
  } catch (error) {
    console.error('Error response data:', error.response?.data); // 에러 응답 데이터 로그
    throw handleApiError(error, 'Failed to register user');
  }
};

// 로그인
export const loginUser = async (userData) => {
  try {
    console.log('Logging in user with data:', userData); // 요청 데이터 로그
    const response = await axios.post(`${API_URL}/users/login`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    localStorage.setItem('token', response.data.token); // 로그인 성공 시 토큰 저장
    return response.data;
  } catch (error) {
    console.error('Error response data:', error.response?.data); // 에러 응답 데이터 로그
    throw handleApiError(error, 'Failed to login');
  }
};

// 이벤트 생성 API 호출
export const createEvent = async (eventData) => {
  try {
    console.log('Creating event with data:', eventData); // 요청 데이터 로그
    const headers = setAuthHeader();
    const response = await axios.post(`${API_URL}/events`, eventData, { headers });
    return response.data;
  } catch (error) {
    console.error('Error response data:', error.response?.data); // 에러 응답 데이터 로그
    throw handleApiError(error, 'Failed to create event');
  }
};

// 이벤트 삭제 API
export const deleteEvent = async (id) => {
  try {
    console.log('Deleting event with ID:', id); // 요청 ID 로그
    const headers = setAuthHeader();
    const response = await axios.delete(`${API_URL}/events/${id}`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error response data:', error.response?.data); // 에러 응답 데이터 로그
    throw handleApiError(error, 'Failed to delete event');
  }
};

// 사용자 주최 이벤트 목록 조회 API 호출
export const getUserHostedEvents = async () => {
  try {
    console.log('Fetching user hosted events'); // 요청 로그
    const headers = setAuthHeader();
    const response = await axios.get(`${API_URL}/events/user/hosted`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error response data:', error.response?.data); // 에러 응답 데이터 로그
    throw handleApiError(error, 'Failed to fetch hosted events');
  }
};

// 사용자 참가 이벤트 목록 조회 API 호출
export const getUserJoinedEvents = async () => {
  try {
    console.log('Fetching user joined events'); // 요청 로그
    const headers = setAuthHeader();
    const response = await axios.get(`${API_URL}/events/user/joined`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error response data:', error.response?.data); // 에러 응답 데이터 로그
    throw handleApiError(error, 'Failed to fetch joined events');
  }
};
