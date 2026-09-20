import { createContext, useContext, useReducer, useEffect } from "react";
import {
  generateOrderId,
  generateTransactionId,
  generateDeliveryPartner,
  getEstimatedDelivery,
} from "../utils/orderGenerator";

const OrderContext = createContext();

const orderReducer = (state, action) => {
  switch (action.type) {
    case "PLACE_ORDER":
      return {
        ...state,
        currentOrder: action.payload,
        orders: [...state.orders, action.payload],
      };
    case "UPDATE_ORDER_STATUS":
      return {
        ...state,
        currentOrder: {
          ...state.currentOrder,
          status: action.payload.status,
          statusSteps: action.payload.steps,
        },
        orders: state.orders.map((o) =>
          o.orderId === state.currentOrder?.orderId
            ? {
                ...o,
                status: action.payload.status,
                statusSteps: action.payload.steps,
              }
            : o
        ),
      };
    case "LOAD_ORDERS":
      return {
        ...state,
        orders: action.payload.orders,
        currentOrder: action.payload.currentOrder,
      };
    case "CLEAR_CURRENT_ORDER":
      return {
        ...state,
        currentOrder: null,
      };
    default:
      return state;
  }
};

const initialOrderState = {
  currentOrder: null,
  orders: [],
};

export function OrderProvider({ children }) {
  const [state, dispatch] = useReducer(orderReducer, initialOrderState);

  useEffect(() => {
    const saved = localStorage.getItem("foodDeliveryOrders");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        dispatch({ type: "LOAD_ORDERS", payload: parsed });
      } catch (e) {
        localStorage.removeItem("foodDeliveryOrders");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "foodDeliveryOrders",
      JSON.stringify({
        orders: state.orders,
        currentOrder: state.currentOrder,
      })
    );
  }, [state]);

  const placeOrder = (orderData) => {
    const orderId = generateOrderId();
    const deliveryPartner = generateDeliveryPartner();
    const estimatedDelivery = getEstimatedDelivery(orderData.deliveryOption);

    const order = {
      orderId,
      ...orderData,
      deliveryPartner,
      estimatedDelivery,
      status: "confirmed",
      statusSteps: {
        confirmed: true,
        accepted: false,
        preparing: false,
        pickedUp: false,
        onTheWay: false,
        delivered: false,
      },
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: "PLACE_ORDER", payload: order });
    return order;
  };

  const updateOrderStatus = (status, steps) => {
    dispatch({ type: "UPDATE_ORDER_STATUS", payload: { status, steps } });
  };

  const clearCurrentOrder = () => {
    dispatch({ type: "CLEAR_CURRENT_ORDER" });
  };

  return (
    <OrderContext.Provider
      value={{
        ...state,
        placeOrder,
        updateOrderStatus,
        clearCurrentOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
