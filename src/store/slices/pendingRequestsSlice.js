import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchMatchingRequestsWithFilters } from '../../services/matchingService.js';

export const fetchPendingRequestsStatus = createAsyncThunk(
    'pendingRequests/fetchStatus',
    async (_, { getState }) => {
        const user = getState().auth.user;
        const data = await fetchMatchingRequestsWithFilters("RECEIVE", "N");

        if (!data || !Array.isArray(data)) {
            return false;
        }

        return data.some(request => request.receiverName === user.name);
    }
);

const pendingRequestsSlice = createSlice({
    name: 'pendingRequests',
    initialState: {
        hasPendingRequests: false
    },
    reducers: {
        updatePendingRequestsStatus(state, action) {
            state.hasPendingRequests = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchPendingRequestsStatus.fulfilled, (state, action) => {
            state.hasPendingRequests = action.payload;
        });
    }
});

const pendingRequestsAction = pendingRequestsSlice.actions;
export { pendingRequestsAction, pendingRequestsSlice };
