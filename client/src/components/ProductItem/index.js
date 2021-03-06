//22.2.6
import React from "react";
import { Link } from "react-router-dom";
import { pluralize } from "../../utils/helpers"
import { useDispatch, useSelector } from 'react-redux';
import { ADD_TO_CART, UPDATE_CART_QUANTITY } from '../../utils/actions';
//22.3.5
import { idbPromise } from '../../utils/helpers';

function ProductItem(item) {
    //https://react-redux.js.org/api/hooks
    //remove useStoreContext, insert react redux hooks
    const dispatch = useDispatch();
    const state = useSelector(state => state);

    const {
        image,
        name,
        _id,
        price,
        quantity
    } = item;

    //22.2.7
    const { cart } = state;

    //update 22.2.7
    const addToCart = () => {
        //find the cart item with the matching id
        const itemInCart = cart.find((cartItem) => cartItem._id === _id);

        //if there was a match, call UPDATE with a new purchaseQuantity
        if (itemInCart) {
            dispatch({
                type: UPDATE_CART_QUANTITY,
                _id: _id,
                purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
            });
            idbPromise('cart', 'put', {
                ...itemInCart,
                purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
            });
        }
        else {
            dispatch({
                type: ADD_TO_CART,
                product: { ...item, purchaseQuantity: 1 }
            });
            idbPromise('cart', 'put', { ...item, purchaseQuantity: 1 });
        }
    }

    return (
        <div className="card px-1 py-1">
            <Link to={`/products/${_id}`}>
                <img
                    alt={name}
                    src={`/images/${image}`}
                />
                <p>{name}</p>
            </Link>
            <div>
                <div>{quantity} {pluralize("item", quantity)} in stock</div>
                <span>${price}</span>
            </div>
            <button onClick={addToCart}>Add to cart</button>
        </div>
    );
}

export default ProductItem;
