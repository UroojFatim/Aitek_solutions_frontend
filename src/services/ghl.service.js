// src/services/ghl.service.js
import axios from 'axios';
import httpClient from './httpClient';
import { GHL_ENDPOINTS } from '@/constants/ghl.constants';

const apikey = import.meta.env.VITE_GHL_API_KEY;
const base_url = import.meta.env.VITE_BASE_GHL_URL;
const ghlService = axios.create({
  baseURL: base_url,
  headers: {
    'Authorization': `Bearer ${apikey}`, 
    'Content-Type': 'application/json',
  },
});

export const getOpportunitiesByPipeline = async (pipelineId, params) => {
    try {
        const res = await ghlService.get(`pipelines/${pipelineId}/opportunities`, {
            params: params
        });
        return res.data;
    } catch (error) {
        throw error;
    }
};

export const getPipelines = async () => {
  try {
    const response = await ghlService.get('/pipelines');
    return response.data.pipelines; 
  } catch (error) {
    throw error;
  }
};

const ghl_service = {
  fetchPipelines: async (locationId) => {
      const res = await httpClient.get(GHL_ENDPOINTS.FETCH_PIPELINES(locationId));
      return res.data?.pipelines || [];

  },
    fetchConversations: async (locationId) => {
      const res = await httpClient.get(GHL_ENDPOINTS.FETCH_CONVERSATIONS(locationId));
      return res.data?.conversations || [];

  },
    fetchOpportunitiesByPipelineId: async (locationId, pipelineId) => {
      const res = await httpClient.get(GHL_ENDPOINTS.FETCH_OPPORTUNIRIES_BY_PIPELINE_ID(locationId, pipelineId));
      return res.data?.opportunities || [];

  },
    fetchMessages: async (conversationId) => {
      const payload = { conversationId };
      const res = await httpClient.post(GHL_ENDPOINTS.FETCH_MESSAGES(),payload);
      return res.data?.messages || [];
  },
      fetchUsers: async (locationId) => {
      const res = await httpClient.get(GHL_ENDPOINTS.FETCH_USERS(locationId));
      return res.data?.users || [];
  },
  sendMessage: async (conversationId, messageText, contactId, type = 'SMS', status = 'pending') => {
    const res = await httpClient.post(GHL_ENDPOINTS.SEND_MESSAGE(), {
    conversationId: conversationId,
    contactId: contactId,
    type: type,
    message: messageText,
    status: status,
    });
    return res.data || res;
  },
createOpportunity: async (payload) => {
  const res = await httpClient.post(
    GHL_ENDPOINTS.CREATE_OPPORTUNITY(),
    { payload }                      
  );
  return res.data || res;
},
updateContact: async (contactId, email, phone, tags = []) => {
  const res = await httpClient.put(
    GHL_ENDPOINTS.UPDATE_CONTACT(),
    {
      contactId,
      email,
      phone,
      tags,
    }
  );

  return res.data?.data || res.data;
},
updateOpportunity: async (opportunityId, payload) => {
    const res = await httpClient.put(
      GHL_ENDPOINTS.UPDATE_OPPORTUNITY(opportunityId),
      { payload }
    );

    return res.data?.data || res.data;
  },

    getContactById: async (contactId) => {
    const res = await httpClient.get(GHL_ENDPOINTS.GET_CONTACT_BY_ID(contactId));
    return res.data?.data || res.data.contact;
  },

  addTagsToContact: async (contactId, tags) => {
    const res = await httpClient.post(
      GHL_ENDPOINTS.ADD_TAGS_TO_CONTACT(),
      { contactId, tags }
    );
    return res.data?.data || res.data;
  },

  removeTagsFromContact: async (contactId, tags) => {
    const res = await httpClient.post(
      GHL_ENDPOINTS.REMOVE_TAGS_FROM_CONTACT(),
      { contactId, tags }
    );
    return res.data?.data || res.data;
  },

getNotes: async (contactId) => {
    const res = await httpClient.get(GHL_ENDPOINTS.GET_NOTES(contactId));
    return res.data?.data || res.data;
  },

  createNote: async (contactId, body) => {
    const res = await httpClient.post(
      GHL_ENDPOINTS.CREATE_NOTE(),
      {
        contactId,
                body
      },
    );
    return res.data?.data || res.data;
  },

  deleteNote: async (contactId, noteId) => {
    const res = await httpClient.post(
      GHL_ENDPOINTS.DELETE_NOTE(),
      {
        contactId,
        id: noteId,
      }
    );
    return res.data?.data || res.data;
  },

  getTasks: async (contactId) => {
  const res = await httpClient.get(GHL_ENDPOINTS.GET_TASKS(contactId));
  return res.data?.data || res.data;
},

createTask: async (contactId, payload) => {
  const res = await httpClient.post(GHL_ENDPOINTS.CREATE_TASK(), {
    contactId,payload
  });
  return res.data?.data || res.data;
},

updateTaskCompleted: async (contactId, taskId, completed) => {
  const res = await httpClient.post(GHL_ENDPOINTS.UPDATE_TASK_COMPLETED(), {
    contactId,
    taskId,
  });
  return res.data?.data || res.data;
},

deleteTask: async (contactId, taskId) => {
  const res = await httpClient.post(GHL_ENDPOINTS.DELETE_TASK(), {
    contactId,
    taskId,
  });
  return res.data?.data || res.data;
},
getCalendars: async (locationId) => {
  const res = await httpClient.get(
    GHL_ENDPOINTS.GET_CALENDARS(locationId)
  );
  return res.data?.data || res.data;
},

getAppointmentsForContact: async (contactId) => {
  const res = await httpClient.get(
    GHL_ENDPOINTS.GET_APPOINTMENTS_FOR_CONTACT(contactId)
  );
  return res.data?.data || res.data;
},

createAppointment: async (payload) => {
  const res = await httpClient.post(
    GHL_ENDPOINTS.CREATE_APPOINTMENT(),
    payload
  );
  
  return res.data?.data || res.data;
},

deleteAppointment: async (eventId) => {
  const res = await httpClient.post(
    GHL_ENDPOINTS.DELETE_APPOINTMENT(),{eventId}
  );
  return res.data?.data || res.data;
},


};

export default ghl_service;
