//22.2.4
import React from 'react';
import { REMOVE_FROM_CART, UPDATE_CART_QUANTITY } from '../../utils/actions';
import { useDispatch } from 'react-redux';
//22.3.5
import { idbPromise } from '../../utils/helpers';

const CartItem = ({ item }) => {
    //CartItem had no need to read state, so only dispatch added,
    //remove useStoreContext and insert only useDispatch (no useSelector)
    //22.2.7
    const dispatch = useDispatch();

    //22.2.7
    const removeFromCart = item => {
        dispatch({
            type: REMOVE_FROM_CART,
            _id: item._id
        });
        //22.3.5
        idbPromise('cart', 'delete', { ...item });
    }

    //22.2.7, update 22.3.5
    const onChange = (e) => {
        const value = e.target.value;

        if (value === '0') {
            dispatch({
                type: REMOVE_FROM_CART,
                _id: item._id
            });

            idbPromise('cart', 'delete', { ...item });
        }
        else {
            dispatch({
                type: UPDATE_CART_QUANTITY,
                _id: item._id,
                purchaseQuantity: parseInt(value)
            });

            idbPromise('cart', 'put', {
                ...item,
                purchaseQuantity: parseInt(value)
            });
        }
    }

    return (
        <div className="flex-row">
            <div>
                <img
                    src={`/images/${item.image}`}
                    alt=""
                />
            </div>
            <div>
                <div>{item.name}, ${item.price}</div>
                <div>
                    <span>Qty:</span>
                    <input
                        type="number"
                        placeholder="1"
                        value={item.purchaseQuantity}
                        onChange={onChange}
                    />
                    <span
                        role="img"
                        aria-label="trash"
                        onClick={() => removeFromCart(item)}
                    >
                        🗑️
                    </span>
                </div>
            </div>
        </div>
    );
}

export default CartItem;