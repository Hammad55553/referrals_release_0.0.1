// features/auth/chatSlice.ts
// handles all chat flow redux data and API calls

import {createSlice, PayloadAction, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {BACKEND_DEV_URL, BACKEND_SOCKET_APP_URL} from '../../constants/Routes';
import {logger} from 'react-native-logs';

var log = logger.createLogger();

interface Message {
  from: string;
  to: string;
  message: string;
  chat_id: string;
  messageByMe: string;
  mid?: string;
  status: string;
  timestamp?: string;
  attachmentUrl: string;
  delete: boolean;
  deleted_at: string;
  edited: boolean;
  edited_at: string;
}

export interface ChatMessage {
  message: string;
  date: string; // includes date and time
  read: boolean;
  delivered: boolean;
}

export interface ChatPerson {
  name: string;
  verified: boolean;
  lastMessage: ChatMessage;
  profilePictureLink: string;
}

export interface ConversationMessage {
  from: string;
  to: string;
  message: string;
  messageByMe: string;
  status: 'READ' | 'DELIVERED' | 'SENT';
  timestamp: string;
  delete: boolean;
  edited: boolean;
  _id: string;
  chat_id: string;
}

export interface Receiver {
  _id: string;
  firstName: string;
  lastName: string;
  uid: string;
  profilePhoto: string;
}

export interface Conversation {
  _id: string;
  users: string[];
  receiver_id: string;
  sender_id: string;
  post_id: string;
  status: 'ACCEPTED' | 'PENDING' | 'REJECTED';
  timestamp: string;
  type: string;
  blocked: boolean;
  messages: ConversationMessage;
  receiver: Receiver;
  createdAt: string;
  __v: number;
  publicKeyOfReceiver: string;
}

const unreadChatPersonsData: ChatPerson[] = [
  {
    name: 'Tim Cook',
    verified: true,
    lastMessage: {
      message: 'Check out the latest updates for WWDC!',
      date: '2024-06-15 04:58:33.588041',
      read: false,
      delivered: true,
    },
    profilePictureLink:
      'https://www.apple.com/leadership/images/bio/tim-cook_image.png.og.png',
  },
  {
    name: 'Elon Musk',
    verified: true,
    lastMessage: {
      message: 'We are launching the new rocket tomorrow.',
      date: '2024-06-14 11:45:12.123456',
      read: false,
      delivered: true,
    },
    profilePictureLink:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Elon_Musk_Colorado_2022_%28cropped2%29.jpg/440px-Elon_Musk_Colorado_2022_%28cropped2%29.jpg',
  },
];

const readChatPersonsData: ChatPerson[] = [
  {
    name: 'Sundar Pichai',
    verified: true,
    lastMessage: {
      message: 'Check the new AI update!',
      date: '2024-06-13 08:00:00.000000',
      read: true,
      delivered: true,
    },
    profilePictureLink:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Sundar_Pichai_-_2023_%28cropped%29.jpg/440px-Sundar_Pichai_-_2023_%28cropped%29.jpg',
  },
  {
    name: 'Satya Nadella',
    verified: true,
    lastMessage: {
      message: 'Azure is scaling up.',
      date: '2024-06-12 10:30:00.000000',
      read: true,
      delivered: true,
    },
    profilePictureLink:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/MS-Exec-Nadella-Satya-2017-08-31-22_%28cropped%29.jpg/440px-MS-Exec-Nadella-Satya-2017-08-31-22_%28cropped%29.jpg',
  },
  {
    name: 'Mark Zuckerberg',
    verified: true,
    lastMessage: {
      message: 'Meta update soon!',
      date: '2024-06-11 12:15:00.000000',
      read: true,
      delivered: true,
    },
    profilePictureLink:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg/440px-Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg',
  },
  {
    name: 'Jeff Bezos',
    verified: true,
    lastMessage: {
      message: 'Prime Day is coming!',
      date: '2024-06-10 14:45:00.000000',
      read: true,
      delivered: true,
    },
    profilePictureLink:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Jeff_Bezos_visits_LAAFB_SMC_%283908618%29_%28cropped%29.jpeg/440px-Jeff_Bezos_visits_LAAFB_SMC_%283908618%29_%28cropped%29.jpeg',
  },
  {
    name: 'Bill Gates',
    verified: true,
    lastMessage: {
      message: 'Great vaccine progress.',
      date: '2024-06-09 16:20:00.000000',
      read: true,
      delivered: true,
    },
    profilePictureLink:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Bill_Gates_2018.jpg/330px-Bill_Gates_2018.jpg',
  },
  {
    name: 'Larry Page',
    verified: true,
    lastMessage: {
      message: 'New search algorithm.',
      date: '2024-06-08 09:50:00.000000',
      read: true,
      delivered: true,
    },
    profilePictureLink:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Larry_Page_in_the_European_Parliament%2C_17.06.2009_%28cropped%29.jpg/440px-Larry_Page_in_the_European_Parliament%2C_17.06.2009_%28cropped%29.jpg',
  },
  {
    name: 'Sergey Brin',
    verified: true,
    lastMessage: {
      message: 'X research is up.',
      date: '2024-06-07 11:25:00.000000',
      read: true,
      delivered: true,
    },
    profilePictureLink:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Sergey_Brin_Ted_2010_%28cropped%29.jpg/440px-Sergey_Brin_Ted_2010_%28cropped%29.jpg',
  },
  {
    name: 'Tim Berners-Lee',
    verified: true,
    lastMessage: {
      message: 'Web updates ongoing.',
      date: '2024-06-06 13:10:00.000000',
      read: true,
      delivered: true,
    },
    profilePictureLink:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Sir_Tim_Berners-Lee_%28cropped%29.jpg/440px-Sir_Tim_Berners-Lee_%28cropped%29.jpg',
  },
  {
    name: 'Sheryl Sandberg',
    verified: true,
    lastMessage: {
      message: 'Meeting at 3 PM.',
      date: '2024-06-05 15:55:00.000000',
      read: true,
      delivered: true,
    },
    profilePictureLink:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Sheryl_Sandberg_WEF_2013_%28crop_by_James_Tamim%29.jpg/440px-Sheryl_Sandberg_WEF_2013_%28crop_by_James_Tamim%29.jpg',
  },
  {
    name: 'Marissa Mayer',
    verified: true,
    lastMessage: {
      message: 'Yahoo revamp news.',
      date: '2024-06-04 17:40:00.000000',
      read: true,
      delivered: true,
    },
    profilePictureLink:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Marissa_Mayer%2C_World_Economic_Forum_2013_III.jpg/440px-Marissa_Mayer%2C_World_Economic_Forum_2013_III.jpg',
  },
  {
    name: 'Steve Jobs',
    verified: true,
    lastMessage: {
      message: 'Apple keynote prep.',
      date: '2024-06-02 21:10:00.000000',
      read: true,
      delivered: true,
    },
    profilePictureLink:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Steve_Jobs_Headshot_2010-CROP_%28cropped_2%29.jpg/440px-Steve_Jobs_Headshot_2010-CROP_%28cropped_2%29.jpg',
  },
  {
    name: 'Jack Ma',
    verified: true,
    lastMessage: {
      message: 'Alibaba expansion.',
      date: '2024-06-01 08:00:00.000000',
      read: true,
      delivered: true,
    },
    profilePictureLink:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Enabling_eCommerce-_Small_Enterprises%2C_Global_Players_%2839008130265%29_%28cropped%29.jpg/440px-Enabling_eCommerce-_Small_Enterprises%2C_Global_Players_%2839008130265%29_%28cropped%29.jpg',
  },
  {
    name: 'Susan Wojcicki',
    verified: true,
    lastMessage: {
      message: 'YouTube update live.',
      date: '2024-05-31 10:30:00.000000',
      read: true,
      delivered: true,
    },
    profilePictureLink:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Susan_Wojcicki_%2829393944130%29_%28cropped%29.jpg/440px-Susan_Wojcicki_%2829393944130%29_%28cropped%29.jpg',
  },
  {
    name: 'Evan Spiegel',
    verified: true,
    lastMessage: {
      message: 'Snapchat redesign.',
      date: '2024-05-30 12:15:00.000000',
      read: true,
      delivered: true,
    },
    profilePictureLink:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Evan_Spiegel%2C_founder_of_Snapchat.jpg/440px-Evan_Spiegel%2C_founder_of_Snapchat.jpg',
  },
  {
    name: 'Reed Hastings',
    verified: true,
    lastMessage: {
      message: 'New series release.',
      date: '2024-05-29 14:00:00.000000',
      read: true,
      delivered: true,
    },
    profilePictureLink:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Re_publica_2015_-_Tag_1_%2817195424118%29.jpg/440px-Re_publica_2015_-_Tag_1_%2817195424118%29.jpg',
  },
];

export {readChatPersonsData};

interface ChatState {
  loading: boolean;
  error: string | null;
  apiCalled: string;
  unreadChatPersons: ChatPerson[];
  readChatPersons: ChatPerson[];
  messageFlowScreen: 'Messages' | 'Requests';
  selectedConversation: Conversation;
  conversationBetweenUsers: Conversation[];
  unreadChatBadgeCount: number;
  newMessages: Message[];
  presignedURL: string;
}

const initialState: ChatState = {
  loading: false,
  error: null,
  apiCalled: '',
  unreadChatPersons: unreadChatPersonsData,
  readChatPersons: readChatPersonsData,
  messageFlowScreen: 'Messages',
  newMessages: [],
  presignedURL: '',
  selectedConversation: {
    _id: '',
    users: [],
    receiver_id: '',
    sender_id: '',
    post_id: '',
    status: 'PENDING',
    timestamp: '',
    type: '',
    blocked: false,
    messages: {
      _id: '',
      delete: false,
      edited: false,
      from: '',
      message: '',
      status: 'SENT',
      timestamp: '',
      to: '',
      chat_id: '',
      messageByMe: '',
    },
    receiver: {
      _id: '',
      firstName: '',
      lastName: '',
      profilePhoto: '',
      uid: '',
    },
    createdAt: '',
    __v: 0,
    publicKeyOfReceiver: '',
  },
  conversationBetweenUsers: [],
  unreadChatBadgeCount: 0,
};

// from receiver point of view
// status SENT (single tick)
// status READ (blue tick)
// status DELIVERED (double tick)

// Define the async thunks
export const getConversationBetweenUsers = createAsyncThunk(
  'messages/convorsations',
  async (firebaseIDToken: string) => {
    try {
      const response = await axios.get(
        `${BACKEND_SOCKET_APP_URL}messages/convorsations`,
        {
          headers: {
            Authorization: `Bearer ${firebaseIDToken}`,
          },
        },
      );
      console.log('Raw response:', response.request._response);
      const parsedResponse = JSON.parse(response.request._response);
      return parsedResponse;
    } catch (error: any) {
      console.log(error.response);
      throw error;
    }
  },
);

export const generatePresignedURL = createAsyncThunk(
  'messages/generatePresignedURL',
  async (data: {
    firebaseIDToken: string;
    fileName: string;
    fileType: string;
  }) => {
    try {
      const response = await axios.post(
        `${BACKEND_DEV_URL}users/data/generate-presigned-url`,
        {
          fileName: data.fileName, //"XYZONE"
          fileType: data.fileType, //"png" or "jpg"
          bucketKey: 'chat',
        },
        {
          headers: {
            Authorization: `Bearer ${data.firebaseIDToken}`,
          },
        },
      );
      console.log('response data:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.log(error.response);
      throw error;
    }
  },
);

const chatSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateSelectedConversation: (
      state,
      action: PayloadAction<Conversation>,
    ) => {
      state.selectedConversation = action.payload;
    },
    updateNewMessages: (state, action: PayloadAction<Message[]>) => {
      state.newMessages = action.payload;
    },
    updateAPICalled: (state, action: PayloadAction<string>) => {
      state.apiCalled = action.payload;
    },
    updateUnreadBadgeCount: (state, action: PayloadAction<number>) => {
      state.unreadChatBadgeCount = action.payload;
    },
    updateLoading(state, action) {
      state.loading = action.payload;
    },
    updateMessageFlowScreen(state, action) {
      state.messageFlowScreen = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getConversationBetweenUsers.pending, state => {
        state.loading = true;
        state.error = null;
        log.debug('pending state');
      })
      .addCase(getConversationBetweenUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        log.debug('fulfilled state payload', action.payload);
        state.conversationBetweenUsers = action.payload.data || []; // Ensure a default value if data is undefined
        log.debug('fulfilled state');
        log.debug('conversationBetweenUsers', state.conversationBetweenUsers);
      })
      .addCase(getConversationBetweenUsers.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.error.message; // Fix to correctly access the error message
        log.debug('error state redux');
        log.debug(action.error.message);
      })
      .addCase(generatePresignedURL.pending, state => {
        state.loading = true;
        state.error = null;
        log.debug('pending state');
      })
      .addCase(generatePresignedURL.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        log.debug('fulfilled state payload', action.payload);
        log.debug('fulfilled state');
        state.presignedURL = action.payload.data;
      })
      .addCase(generatePresignedURL.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.error.message; // Fix to correctly access the error message
        log.debug('error state redux');
        log.debug(action.error.message);
      });
  },
});

export const {
  updateUnreadBadgeCount,
  updateSelectedConversation,
  updateAPICalled,
  updateLoading,
  updateMessageFlowScreen,
  updateNewMessages,
} = chatSlice.actions;
export default chatSlice.reducer;
