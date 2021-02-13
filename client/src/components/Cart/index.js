//22.2.4, update 22.3.5
import React, { useEffect } from 'react';
//22.4.5
import { useLazyQuery } from '@apollo/react-hooks';
import { useDispatch, useSelector } from 'react-redux';
import CartItem from '../CartItem';
import Auth from '../../utils/auth';
import './style.css';
//22.2.5
import { useStoreContext } from '../../utils/GlobalState';
//update 22.3.5
import { TOGGLE_CART, ADD_MULTIPLE_TO_CART } from '../../utils/actions';
import { idbPromise } from '../../utils/helpers';
//22.4.5
import { QUERY_CHECKOUT } from '../../utils/queries';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

//https://redux.js.org/tutorials/fundamentals/part-1-overview
/* We need to respond to user input by creating action objects
 that describe what happened, and dispatching them to the store. 
 When we call store.dispatch(action), the store runs the reducer, 
 calculates the updated state, and runs the subscribers to update 
 the UI. */

const Cart = () => {
    //https://react-redux.js.org/api/hooks
    //remove useStoreContext, insert react redux hooks
    const dispatch = useDispatch();
    const state = useSelector(state => state);
    const [getCheckout, { data }] = useLazyQuery(QUERY_CHECKOUT);
    console.log(state);

    //22.3.5
    useEffect(() => {
        async function getCart() {
            const cart = await idbPromise('cart', 'get');
            dispatch({
                type: ADD_MULTIPLE_TO_CART,
                products: [...cart]
            });
        }
        if (!state.cart.length) {
            getCart();
        }
    }, [state.cart.length, dispatch]);

    //22.4.5
    useEffect(() => {
        if (data) {
            stripePromise.then((res) => {
                res.redirectToCheckout({ sessionId: data.checkout.session });
            });
        }
    }, [data]);

    function toggleCart() {
        dispatch({ type: TOGGLE_CART });
    }

    function calculateTotal() {
        let sum = 0;
        state.cart.forEach(item => {
            sum += item.price * item.purchaseQuantity;
        });
        return sum.toFixed(2);
    }

    //22.4.5
    function submitCheckout() {
        const productIds = [];

        state.cart.forEach((item) => {
            for (let i = 0; i < item.purchaseQuantity; i++) {
                productIds.push(item._id);
            }
        });

        getCheckout({
            variables: { products: productIds }
        });
    }

    if (!state.cartOpen) {
        return (
            <div className="cart-closed" onClick={toggleCart}>
                <span role="img" aria-label="cart">🛒</span>
            </div>
        )
    }

    return (
        <div className="cart">
            <div className="close" onClick={toggleCart}>[close]</div>
            <h2>Shopping Cart</h2>
            {state.cart.length ?
                (
                    <div>
                        {state.cart.map(item => (
                            <CartItem key={item._id} item={item} />
                        ))}
                        <div className="flex-row space-between">
                            <strong>Total: ${calculateTotal()}</strong>
                            {
                                Auth.loggedIn() ?
                                    <butto onClick={submitCheckout}>
                                        Checkout
                                    </butto>
                                    :
                                    <span> (login to checkout)</span>
                            }
                        </div>
                    </div>
                ) : (
                    <h3>
                        <span role="img" aria-label="shocked">
                            😱
                    </span>
                        You haven't added anything to your cart yet!
                    </h3>
                )
            }
        </div>
    );
}

export default Cart;