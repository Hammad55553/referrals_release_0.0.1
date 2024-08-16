import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import axios from 'axios';
import {RootState} from '../store';
import {BACKEND_DEV_URL} from '../../constants/Routes';
import {getFirebaseToken} from '../utils/getFirebaseToken';
import {Address} from './postSlice';
import {logger} from 'react-native-logs';
import AsyncStorage from '@react-native-async-storage/async-storage';

var log = logger.createLogger();

export interface Post {
  imgUrl: string[];
  availableFrom: string;
  category: string;
  categoryType?: string;
  titleOfPost: string;
  address: Address;
  priceFrom: {$numberDecimal: string};
  priceTo: {$numberDecimal: string};
  apartmentType?: string;
  facilities: string[];
  _id: string;
}

export interface ViewPostState {
  loading: boolean;
  error: string | null;
  posts: Post[];
  hasMore: boolean;
}

const initialState: ViewPostState = {
  loading: false,
  error: null,
  posts: [],
  hasMore: true,
};

interface FetchPostsArgs {
  state?: string;
  category?: string;
  categoryType?: string;
  page: number;
}

export const fetchPostsTwo = createAsyncThunk(
  'viewPosts/fetchPostsForAll',
  async (data: {firebaseIDToken: string}) => {
    try {
      const response = await axios.get(
        `${BACKEND_DEV_URL}users/post/allposts`,
        {
          headers: {
            Authorization: `Bearer ${data.firebaseIDToken}`, // Include the token in the headers
            'Content-Type': 'application/json',
          },
        },
      );
      log.info('heehehe ', response.data);

      return response.data.data; // Assuming the response has a 'posts' array
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const fetchPosts = createAsyncThunk<Post[], FetchPostsArgs>(
  'viewPosts/fetchPosts',
  async ({state, category, categoryType, page}, {rejectWithValue}) => {
    try {
      const token = await getFirebaseToken();
      const response = await axios.get(
        `${BACKEND_DEV_URL}users/post/searchpost`,
        {
          params: {
            state,
            category,
            categoryType,
            page,
            toShowData: true,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data.data;
    } catch (error: any) {
      if (error.response.data.message === 'auth/id-token-expired') {
        // update id token
        const data = await AsyncStorage.getAllKeys();
        log.info('HI ', data);
      }
      return rejectWithValue(error.response.data);
    }
  },
);

const viewPostSlice = createSlice({
  name: 'viewPosts',
  initialState,
  reducers: {
    clearPosts: state => {
      state.posts = [];
      state.hasMore = true;
    },
    removePost(state, action: PayloadAction<string>) {
      console.log('Removing post with ID:', action.payload);
      state.posts = state.posts.filter(post => post._id !== action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPosts.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.posts = action.payload;
        state.hasMore = action.payload.length === 20;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPostsTwo.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostsTwo.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.posts = action.payload;
        state.hasMore = action.payload.length === 20;
      })
      .addCase(fetchPostsTwo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {clearPosts, removePost} = viewPostSlice.actions;

export const selectPosts = (state: RootState) => state.viewPosts.posts;
export const selectLoading = (state: RootState) => state.viewPosts.loading;
export const selectError = (state: RootState) => state.viewPosts.error;
export const selectHasMore = (state: RootState) => state.viewPosts.hasMore;

export default viewPostSlice.reducer;
function rejectWithValue(data: any): any {
  throw new Error('Function not implemented.');
}
