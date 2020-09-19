import React, {useEffect} from 'react'
import {useDispatch} from 'react-redux';
import { getCartItems } from "../../../_actions/user_actions";

export default (props) => {

    const dispatch = useDispatch();

    useEffect(() => {
       let cartItems = [];
       if(props.user.userData && props.user.userData.cart){
           if(props.user.userData.cart.length > 0) {
               props.user.userData.cart.forEach(item => {
                   cartItems.push(item.id)
               });
               dispatch(getCartItems(cartItems, props.user.userData.cart));
           }
       }
    }, [props.user.userData])

    return (
        <div>
            CartPage
        </div>
    )
}
