import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import axios from 'axios';
import {RootState} from '../store';
import {BACKEND_DEV_URL} from '../../constants/Routes';
import {getFirebaseToken} from '../utils/getFirebaseToken';
import {Address} from './postSlice';
import {logger} from 'react-native-logs';

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

export interface YourPostState {
  loading: boolean;
  error: string | null;
  posts: Post[];
  hasMore: boolean;
}

const initialState: YourPostState = {
  loading: false,
  error: null,
  posts: [],
  hasMore: true,
};

export const fetchPosts = createAsyncThunk<Post[]>(
  'viewPosts/fetchPosts',
  async () => {
    log.info('fetch your posts is called');
    try {
      const token = await getFirebaseToken();
      const response = await axios.get(
        `${BACKEND_DEV_URL}users/post/searchpost`,
        {
          params: {
            toShowData: false, //fetch my posts only
          },
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
            'Content-Type': 'application/json',
          },
        },
      );
      log.info(response.data.data);
      return response.data.data; // Assuming the response has a 'posts' array
    } catch (error: any) {
      log.info('1 ', error.error.message);
      console.error('Error fetching posts:', error);
    }
  },
);

const yourPostsSlice = createSlice({
  name: 'yourPosts',
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
      });
  },
});

export const {clearPosts, removePost} = yourPostsSlice.actions;

export const selectPosts = (state: RootState) => state.yourPosts.posts;
export const selectLoading = (state: RootState) => state.yourPosts.loading;
export const selectError = (state: RootState) => state.yourPosts.error;
export const selectHasMore = (state: RootState) => state.yourPosts.hasMore;

export default yourPostsSlice.reducer;
