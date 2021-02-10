//22.1.6
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from '@apollo/react-hooks';

import { QUERY_PRODUCTS } from "../utils/queries";
import spinner from '../assets/spinner.gif'
import { useStoreContext } from '../utils/GlobalState';
//update 22.2.6
import {
    UPDATE_PRODUCTS,
    REMOVE_FROM_CART,
    ADD_TO_CART,
    UPDATE_CART_QUANTITY
} from '../utils/actions';
//22.2.4
import Cart from '../components/Cart';
//22.3.4
import { idbPromise } from '../utils/helpers';

function Detail() {
    //22.1.6
    const [state, dispatch] = useStoreContext();
    const { id } = useParams();
    const [currentProduct, setCurrentProduct] = useState({});
    const { loading, data } = useQuery(QUERY_PRODUCTS);
    const { products, cart } = state;

    useEffect(() => {
        //already in GlobalState store
        if (products.length) {
            setCurrentProduct(products.find(product => product._id === id));
        }
        //retrieved from server
        else if (data) {
            dispatch({
                type: UPDATE_PRODUCTS,
                products: data.products
            });

            data.products.forEach((product) => {
                idbPromise('products', 'put', product);
            });
        }
        //get cache from indexedDB
        else if (!loading) {
            idbPromise('products', 'get').then((indexedProducts) => {
                dispatch({
                    type: UPDATE_PRODUCTS,
                    products: indexedProducts
                });
            });
        }
    }, [products, data, loading, dispatch, id]);

    //update 22.2.7, 22.3.5
    const addToCart = () => {
        const itemInCart = cart.find((cartItem) => cartItem._id === id);

        if (itemInCart) {
            dispatch({
                type: UPDATE_CART_QUANTITY,
                _id: id,
                purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
            });
            //updating quantity: use existing item data and increment 
            //purchaseQuantity value by one
            idbPromise('cart', 'put', {
                ...itemInCart,
                purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
            });
        }
        else {
            dispatch({
                type: ADD_TO_CART,
                product: { ...currentProduct, purchaseQuantity: 1 }
            });
            //if product isn't in the cart yet,
            //add it to the current shopping cart indexedDB
            idbPromise('cart', 'put', { ...currentProduct, purchaseQuantity: 1 });
        }
    }

    //22.2.7, update 22.3.5
    const removeFromCart = () => {
        dispatch({
            type: REMOVE_FROM_CART,
            _id: currentProduct._id
        });
        //upon removal from cart, delete the item from indexedDB using the
        //'currentProduct._id' to locate what to remove
        idbPromise('cart', 'delete', { ...currentProduct });
    }

    return (
        <>
            {currentProduct ? (
                <div className="container my-1">
                    <Link to="/">
                        ← Back to Products
                    </Link>

                    <h2>{currentProduct.name}</h2>

                    <p>
                        {currentProduct.description}
                    </p>

                    <p>
                        <strong>Price:</strong>
                            ${currentProduct.price}
                        {" "}
                        <button onClick={addToCart}>
                            Add to Cart
                        </button>
                        <button
                            disabled={!cart.find(p => p._id === currentProduct._id)}
                            onClick={removeFromCart}
                        >
                            Remove from Cart
                        </button>
                    </p>

                    <img
                        src={`/images/${currentProduct.image}`}
                        alt={currentProduct.name}
                    />
                </div>
            ) : null}
            {
                loading ? <img src={spinner} alt="loading" /> : null
            }
            <Cart />
        </>
    );
};

export default Detail;
