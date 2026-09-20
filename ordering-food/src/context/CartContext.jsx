import { createContext, useContext, useReducer, useEffect } from "react";
import { calculateCartTotal } from "../utils/priceCalculator";

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const { item, restaurantId, restaurantName } = action.payload;
      if (state.restaurantId && state.restaurantId !== restaurantId) {
        if (!window.confirm(`Your cart has items from ${state.restaurantName}. Adding items from a different restaurant will clear the cart. Continue?`)) {
          return state;
        }
        return {
          items: [{ ...item, cartId: Date.now() }],
          restaurantId,
          restaurantName,
          couponCode: null,
          couponDiscount: 0,
        };
      }
      const existingIndex = state.items.findIndex(
        (i) =>
          i.id === item.id &&
          i.selectedSize === item.selectedSize &&
          JSON.stringify(i.selectedAddOns) === JSON.stringify(item.selectedAddOns) &&
          i.specialInstructions === item.specialInstructions
      );
      if (existingIndex >= 0) {
        const updated = [...state.items];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + item.quantity,
        };
        return { ...state, items: updated };
      }
      return {
        ...state,
        items: [...state.items, { ...item, cartId: Date.now() }],
        restaurantId,
        restaurantName,
      };
    }
    case "UPDATE_QUANTITY": {
      const { cartId, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((i) => i.cartId !== cartId),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.cartId === cartId ? { ...i, quantity } : i
        ),
      };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.cartId !== action.payload),
      };
    case "CLEAR_CART":
      return {
        items: [],
        restaurantId: null,
        restaurantName: null,
        couponCode: null,
        couponDiscount: 0,
      };
    case "APPLY_COUPON":
      return {
        ...state,
        couponCode: action.payload.code,
        couponDiscount: action.payload.discount,
      };
    case "REMOVE_COUPON":
      return {
        ...state,
        couponCode: null,
        couponDiscount: 0,
      };
    case "LOAD_CART":
      return action.payload;
    default:
      return state;
  }
};

const initialState = {
  items: [],
  restaurantId: null,
  restaurantName: null,
  couponCode: null,
  couponDiscount: 0,
};

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    const saved = localStorage.getItem("foodDeliveryCart");
    if (saved) {
      try {
        dispatch({ type: "LOAD_CART", payload: JSON.parse(saved) });
      } catch (e) {
        localStorage.removeItem("foodDeliveryCart");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("foodDeliveryCart", JSON.stringify(state));
  }, [state]);

  const addItem = (item, restaurantId, restaurantName) => {
    dispatch({ type: "ADD_ITEM", payload: { item, restaurantId, restaurantName } });
  };

  const updateQuantity = (cartId, quantity) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { cartId, quantity } });
  };

  const removeItem = (cartId) => {
    dispatch({ type: "REMOVE_ITEM", payload: cartId });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const applyCoupon = (code, discount) => {
    dispatch({ type: "APPLY_COUPON", payload: { code, discount } });
  };

  const removeCoupon = () => {
    dispatch({ type: "REMOVE_COUPON" });
  };

  const pricing = calculateCartTotal(
    state.items,
    state.items.length > 0 ? 30 : 0,
    state.couponDiscount
  );

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        ...state,
        itemCount,
        pricing,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
