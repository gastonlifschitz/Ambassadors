import axios from 'axios';
import authService from './authService';

const service = {};

let axiosInstance = null;

service.setToken = token => {
  authService.setToken(token);
  axiosInstance = axios.create({
    headers: {
      authorization: `Bearer ${token}`
    }
  });
};

const PER_PAGE = 25;

service.getEvents = params => axiosInstance.get('/api/events', {
  params: {
    ...params,
    per_page: PER_PAGE
  }
});

service.getEvent = id => axiosInstance.get(`/api/events/${id}`);

service.editEvent = (id, newEvent) => axiosInstance.put(`/api/events/${id}`, newEvent);

service.createEvent = event => axiosInstance.post('/api/events', event);

service.deleteEvent = id => axiosInstance.delete(`/api/events/${id}`);

service.approveEvent = (id, message) => axiosInstance.post(`/api/events/${id}/state`, {
  state: 'approved',
  message
});

service.rejectEvent = (id, message) => axiosInstance.post(`/api/events/${id}/state`, {
  state: 'scheduled',
  message
});

service.completeEvent = (id, message, feedback, assistants, speakers) => axiosInstance.post(`/api/events/${id}/state`, {
  state: 'completed',
  message,
  feedback,
  actualAssistants: assistants,
  speakers
});

service.cancelEvent = (id, message) => axiosInstance.post(`/api/events/${id}/state`, {
  state: 'cancelled',
  message
});

service.subscribe = async subscriber => {
  const response = await axiosInstance.post('/api/subscribers', subscriber);
  service.setToken(response.data.token);
  return response;
};

service.getSubscribers = params => axiosInstance.get('/api/subscribers', {
  params: {
    ...params,
    per_page: PER_PAGE
  }
})

service.getSubscriber = id => axiosInstance.get(`/api/subscribers/${id}`);

//service.addUnsubscriber = unsubscriber => axiosInstance.post('/api/unsubscribers',unsubscriber);
service.addUnsubscriber = async unsubscriber => {
  const response = await axiosInstance.post('/api/unsubscribers', unsubscriber);
  service.setToken(response.data.token);

  return response;
};

service.getSubscriberList = id => axiosInstance.get('/api/subscribers');

export default service;