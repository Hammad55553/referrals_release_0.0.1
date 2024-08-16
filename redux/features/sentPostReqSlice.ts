import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import { BACKEND_DEV_URL } from '../../constants/Routes';
import { getFirebaseToken } from '../utils/getFirebaseToken'; 


export interface Address {
  streetNameNumber: string;
  apartMent: string;
  city: string;
  state: string;
  zipcode: string;
  lat: number;
  long: number;
}

export interface Post {
  _id: string;
  category: string;
  categoryType?: string;
  imgUrl: string[];
  titleOfPost: string;
  postDescription?: string; // Example of optional field from backend
  address: Address;
  availableFrom: string;
  priceFrom: { $numberDecimal: string };
  priceTo: { $numberDecimal: string };
  apartmentType?: string;
  facilities: string[];
  id: string; // This should map to _id from backend
}

export interface SentPostState {
  loading: boolean;
  error: string | null;
  posts: Post[];
  hasMore: boolean;
}

const initialState: SentPostState = {
  loading: false,
  error: null,
  posts: [],
  hasMore: true,
};

export const fetchPosts = createAsyncThunk<Post[]>(
  'sentPosts/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      const token = await getFirebaseToken(); 
      const response = await axios.get(`${BACKEND_DEV_URL}users/post/request`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data.data.posts; // Assuming the response structure has a 'posts' array
    } catch (error) {
      console.error('Error fetching posts:', error);
      return rejectWithValue('Failed to fetch posts'); // Handle rejection with value
    }
  }
);

const SentPostsSlice = createSlice({
  name: 'sentPosts',
  initialState,
  reducers: {
    clearPosts: (state) => {
      state.posts = [];
      state.hasMore = true;
    },
    removePost: (state, action: PayloadAction<string>) => {
      console.log('Removing post with ID:', action.payload);
      state.posts = state.posts.filter(post => post.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.posts = action.payload;
        state.hasMore = action.payload.length === 20; // Update based on response logic
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearPosts, removePost } = SentPostsSlice.actions;

export const selectPosts = (state: RootState) => state.sentPosts.posts;
export const selectLoading = (state: RootState) => state.sentPosts.loading;
export const selectError = (state: RootState) => state.sentPosts.error;
export const selectHasMore = (state: RootState) => state.sentPosts.hasMore;

export default SentPostsSlice.reducer;
