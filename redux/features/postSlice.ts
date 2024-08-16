import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BACKEND_DEV_URL } from '../../constants/Routes';
import { logger } from 'react-native-logs';
import { getFirebaseToken } from '../utils/getFirebaseToken'; 


var log = logger.createLogger();

export interface Address {
  streetNameNumber: string;
  apartMent: string;
  city: string;
  state: string;
  zipcode: string;
  lat: number;
  long: number;
}

export interface PostFormState {
  uid: string;
  category: string;
  categoryType: string;
  imgUrl: string[];
  titleOfPost: string;
  postDescription: string;
  address: Address;
  availableFrom: Date | null; 
  rent: number;
  apartmentType: string;
  facilities: string[];
  priceFrom?: number;
  priceTo?: number;
  isDelete: boolean;
  loading: boolean; 
  error: string | null; 
}

const initialState: PostFormState = {
  uid: '',
  category: '',
  categoryType: '',
  imgUrl: [],
  titleOfPost: '',
  postDescription: '',
  address: {
    streetNameNumber: '',
    apartMent: '',
    city: '',
    state: '',
    zipcode: '',
    lat: 0,
    long: 0,
  },
  availableFrom: null,
  rent: 0,
  apartmentType: '',
  facilities: [],
  priceFrom: 0,
  priceTo: 0,
  isDelete: false,
  loading: false,
  error: null,
};

interface ErrorResponse {
  message: string;
}

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
          fileName: data.fileName,
          fileType: data.fileType,
          bucketKey: 'sublease-post',
        },
        {
          headers: {
            Authorization: `Bearer ${data.firebaseIDToken}`,
          },
        },
      );
      console.log('response data:', response.data);
      return response.data;
    } catch (error: any) {
      console.log(error.response);
      throw error;
    }
  },
);

const postForm = createAsyncThunk<
  any,
  PostFormState,
  { rejectValue: ErrorResponse }
>(
  'users/post',
  async (postData: PostFormState, { rejectWithValue }) => {
    try {
      const token = await getFirebaseToken(); 

      const response = await axios.post(
        `${BACKEND_DEV_URL}users/post/`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.log('Error posting form:', JSON.stringify(error.response.data, null, 2));
      return rejectWithValue({ message: error.response.data });
    }
  }
);

const PostFormSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setUid(state, action: PayloadAction<string>) {
      state.uid = action.payload;
    },
    setCategory(state, action: PayloadAction<string>) {
      state.category = action.payload;
    },
    setCategoryType(state, action: PayloadAction<string>) {
      state.categoryType = action.payload;
    },
    setImgUrl(state, action: PayloadAction<string[] >) {
      state.imgUrl = action.payload;
    },
    setTitle(state, action: PayloadAction<string>) {
      state.titleOfPost = action.payload;
    },
    setDescription(state, action: PayloadAction<string>) {
      state.postDescription = action.payload;
    },
    setDate(state, action: PayloadAction<Date | null>) { 
      state.availableFrom = action.payload;
    },
    setCity(state, action: PayloadAction<string>) {
      state.address.city = action.payload;
    },
    setState(state, action: PayloadAction<string>) {
      state.address.state = action.payload;
    },
    setPriceFrom(state, action: PayloadAction<number>) {
      state.priceFrom = action.payload;
    },
    setPriceTo(state, action: PayloadAction<number>) {
      state.priceTo = action.payload;
    },
    setIsDelete(state, action: PayloadAction<boolean>) {
      state.isDelete = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postForm.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(postForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong';
        log.debug('Error state redux:');
        log.debug(action.payload);
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
  setUid,
  setCategory,
  setCategoryType,
  setImgUrl,
  setTitle,
  setDescription,
  setDate,
  setCity,
  setState,
  setPriceFrom,
  setPriceTo,
  setIsDelete,
} = PostFormSlice.actions;

export { postForm };

export default PostFormSlice.reducer;
