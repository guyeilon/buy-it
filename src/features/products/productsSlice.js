import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { sub } from 'date-fns';
import { apiSlice } from '../api/apiSlice';

const productsAdapter = createEntityAdapter({
	sortComparer: (a, b) => b.date.localeCompare(a.date),
	selectId: item => item._id,
});

const initialState = productsAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({
	endpoints: builder => ({
		getProducts: builder.query({
			query: () => '/products',
			transformResponse: responseData => {
				let min = 1;
				const loadedProducts = responseData.map(product => {
					if (!product?.date) product.date = sub(new Date(), { minutes: min++ }).toISOString();
					if (!product?.stats)
						product.stats = {
							order: 0,
							uniqueOrder: 0,
						};

					return product;
				});
				return productsAdapter.setAll(initialState, loadedProducts);
			},
			providesTags: (result, error, arg) => [
				{ type: 'Product', id: 'LIST' },
				...result.ids.map(id => ({ type: 'Product', id })),
			],
		}),
		addNewProduct: builder.mutation({
			query: initialProduct => ({
				url: '/products',
				method: 'POST',
				body: {
					...initialProduct,
					date: new Date().toISOString(),
					stats: {
						order: 0,
						uniqueOrder: 0,
					},
				},
			}),
			invalidatesTags: [{ type: 'Product', id: 'LIST' }],
		}),
		updateProduct: builder.mutation({
			query: initialProduct => ({
				url: `/products/${initialProduct._id}`,
				method: 'PATCH',
				body: {
					...initialProduct,
					date: new Date().toISOString(),
				},
			}),
			invalidatesTags: (result, error, arg) => [{ type: 'Product', _id: arg._id }],
		}),
		deleteProduct: builder.mutation({
			query: ({ id }) => ({
				url: `/products/${id}`,
				method: 'DELETE',
				body: { id },
			}),
			invalidatesTags: (result, error, arg) => [{ type: 'Product', id: arg.id }],
		}),
		addStatsToProduct: builder.mutation({
			query: ({ productId, stats }) => ({
				url: `/products/${productId}`,
				method: 'PATCH',
				body: { stats },
			}),
			async onQueryStarted({ productId, stats }, { dispatch, queryFulfilled }) {
				const patchResult = dispatch(
					extendedApiSlice.util.updateQueryData('getProducts', undefined, draft => {
						const product = draft.entities[productId];
						if (product) product.stats = stats;
					})
				);
				try {
					await queryFulfilled;
				} catch {
					patchResult.undo();
				}
			},
		}),
	}),
});

export const {
	useGetProductsQuery,
	useAddNewProductMutation,
	useUpdateProductMutation,
	useDeleteProductMutation,
	useAddStatsToProductMutation,
} = extendedApiSlice;

export const selectProductsResult = extendedApiSlice.endpoints.getProducts.select();

const selectProductsData = createSelector(selectProductsResult, productResult => productResult.data);

export const {
	selectAll: selectAllProducts,
	selectIds: selectProductsIds,
	selectById: selectProductById,
} = productsAdapter.getSelectors(state => selectProductsData(state) ?? initialState);
