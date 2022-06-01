import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({ baseUrl: 'https://buyit-react.herokuapp.com' }),
	tagTypes: ['Product', 'Sale'],
	endpoints: builder => ({}),
});
