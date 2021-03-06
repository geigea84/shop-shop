//22.1.6
import React, { useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";

import ProductItem from "../ProductItem";
import { QUERY_PRODUCTS } from "../../utils/queries";
import spinner from "../../assets/spinner.gif";
import { useDispatch, useSelector } from 'react-redux';
import { UPDATE_PRODUCTS } from "../../utils/actions";
//22.3.4
import { idbPromise } from '../../utils/helpers';

function ProductList() {
    //22.1.6
    //https://react-redux.js.org/api/hooks
    //remove useStoreContext, insert react redux hooks
    const dispatch = useDispatch();
    const state = useSelector(state => state);
    const { currentCategory } = state;
    const { loading, data } = useQuery(QUERY_PRODUCTS);

    //update 22.3.4
    useEffect(() => {
        //if there's data to be stored
        if (data) {
            //store data in the GlobalState object
            dispatch({
                type: UPDATE_PRODUCTS,
                products: data.products
            });

            //save data to indexedDB using the helper (helpers.js) function
            data.products.forEach((product) => {
                idbPromise('products', 'put', product);
            });
        }
        //add else if to check if 'loading' is undefind in 'useQuery()' hook
        else if (!loading) {
            //since we're offline, get all of the data from the 'products' store
            idbPromise('products', 'get').then((products) => {
                //use retrieved data to set GlobalState for offline browsing
                dispatch({
                    type: UPDATE_PRODUCTS,
                    products: products
                });
            });
        }
    }, [data, loading, dispatch]);

    function filterProducts() {
        if (!currentCategory) {
            return state.products;
        }
        
        return state.products.filter(product => product.category._id === currentCategory);
    }

    return (
        <div className="my-2">
        <h2>Our Products:</h2>
        {state.products.length ? (
            <div className="flex-row">
            {filterProducts().map((product) => (
                <ProductItem
                key={product._id}
                _id={product._id}
                image={product.image}
                name={product.name}
                price={product.price}
                quantity={product.quantity}
                />
            ))}
            </div>
        ) : (
            <h3>You haven't added any products yet!</h3>
        )}
        {loading ? <img src={spinner} alt="loading" /> : null}
        </div>
    );
}

export default ProductList;
