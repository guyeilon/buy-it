import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { format } from 'date-fns';
import { apiSlice } from '../api/apiSlice';

const salesAdapter = createEntityAdapter({
	sortComparer: (a, b) => a.date.localeCompare(b.date),
	selectId: item => item._id,
});

const initialState = salesAdapter.getInitialState();

export const salesApiSlice = apiSlice.injectEndpoints({
	endpoints: builder => ({
		getSales: builder.query({
			query: () => '/sales',
			transformResponse: responseData => {
				return salesAdapter.setAll(initialState, responseData);
			},
			providesTags: (result, error, arg) => [
				{ type: 'Sale', id: 'LIST' },
				...result.ids.map(id => ({ type: 'Sale', id })),
			],
		}),
		addNewSale: builder.mutation({
			query: initialSale => ({
				url: '/sales',
				method: 'POST',
				body: {
					...initialSale,
					date: format(new Date(), 'MM/dd/yyyy'),
				},
			}),
			invalidatesTags: [{ type: 'Sale', id: 'LIST' }],
		}),
		updateSale: builder.mutation({
			query: ({ saleId, totalSale }) => ({
				url: `/sales/${saleId}`,
				method: 'PATCH',
				body: { totalSale },
			}),
			invalidatesTags: (result, error, arg) => [{ type: 'Sale', id: arg.id }],
		}),
	}),
});

export const { useAddNewSaleMutation, useGetSalesQuery, useUpdateSaleMutation } = salesApiSlice;

export const selectSalesResult = salesApiSlice.endpoints.getSales.select();

const selectSalesData = createSelector(selectSalesResult, saleResult => saleResult.data);

export const {
	selectAll: selectAllSales,
	selectIds: selectSalesIds,
	selectById: selectSaleById,
} = salesAdapter.getSelectors(state => selectSalesData(state) ?? initialState);
