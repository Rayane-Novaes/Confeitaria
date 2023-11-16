import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const initialState = {
  cartItems: [], 
  totalValor: 0, 

};

const cartReducer = (state, action) => {
  switch (action.type) {
// ...

case 'ADD_TO_CART':
  const existingProductIndex = state.cartItems.findIndex((item) => item.id === action.payload.id);

  if (existingProductIndex !== -1) {
    // Produto já existe no carrinho
    const updatedCart = state.cartItems.map((item, index) =>
      index === existingProductIndex
        ? { ...item, quantidade: item.quantidade + 1, totalItem: (item.quantidade + 1) * item.valor }
        : item
    );

    const newTotalValor = updatedCart.reduce((total, item) => total + item.totalItem, 0);

    return {
      ...state,
      cartItems: updatedCart,
      totalValor: newTotalValor,
    };
  } else {
    // Produto ainda não está no carrinho
    return {
      ...state,
      cartItems: [
        ...state.cartItems,
        { ...action.payload, quantidade: 1, totalItem: action.payload.valor },
      ],
      totalValor: state.totalValor + action.payload.valor,
    };
  }


    case 'REMOVE_FROM_CART':
        const itemIndex = state.cartItems.findIndex((item) => item.id === action.payload.id);

        if (itemIndex !== -1) {
          const updatedCart = [...state.cartItems];
          const removedItem = updatedCart.splice(itemIndex, 1)[0];

          const novoValor = state.totalValor - removedItem.totalItem;

          return {
            ...state,
            cartItems: updatedCart,
            totalValor: novoValor,
          };
        } else {
          return state; 
        }

    case 'CLEAR_CART':
      return {
        ...state,
        cartItems: [],
        totalValor: 0,
      };
    default:
      return state;
  }
};




export const CartProvider = ({ children }) => {
  const [cartState, dispatch] = useReducer(cartReducer, initialState);

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ cartState, dispatch, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
