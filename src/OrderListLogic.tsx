import { ReactNode, createContext, useContext, useState} from 'react';

interface OrderItem {
  id: number,
  name: string,
  count: number,
  price: number
}

let fakeData: OrderItem[] = [
  {
    id: 1,
    name: 'Calamari Rings',
    count: 1,
    price: 6.02
  },
  {
    id: 2,
    name: 'Spinach Artichoke Dip',
    count: 2,
    price: 16.86
  },
  {
    id: 3,
    name: 'Cream of Mushroom Soup',
    count: 2,
    price: 10.05
  },
  {
    id: 4,
    name: 'Minestrone Soup',
    count: 1,
    price: 15.02
  },
]

export const OrderListContext = createContext<{
    orderData: OrderItem[]
    incrementCount: (id:number) => void,
    decrementCount: (id:number) => void,
    addItem: (newItem:{id:number, name:string, price:number}) => void,
    subTotal: number,
    tax: number,
    platformFee: number,
    orderTotal: number
}>({});

export function OrderListProvider({
  children
}:{
  children: ReactNode
}){

  const [orderData, setOrderData] = useState<OrderItem[]>(fakeData)
  
  let subTotal = orderData.reduce((total, order) => {
    return total + order.price*order.count;
  },0);
  let tax = 0.025*subTotal;
  const platformFee = 0.5;
  let orderTotal = subTotal + tax + platformFee;

  const incrementCount = (id:number) => {
    const item = orderData.find((order) => order.id == id);
    if(item){
      const updatedOrderData = orderData.map((order) => {
        if (order.id === id){
          return {...order, count:order.count + 1}
        }
        return order
      });
      setOrderData(updatedOrderData);
    }
  }

  const decrementCount = (id:number) => {
    const item = orderData.find((order) => order.id == id);
    if(item){
      if( item.count == 1){
        let updatedOrderData = [...orderData].filter((order) => order.id != id)
        setOrderData(updatedOrderData);
      }
      else{
        const updatedOrderData = orderData.map((order) => {
          if (order.id === id){
            return {...order, count:order.count - 1}
          }
          return order;
        });
        setOrderData(updatedOrderData);
      }
    }
  }
  
  const addItem = ({id, name, price}:{id:number, name:string, price: number}) => setOrderData([...orderData, {id, name, price, count: 1}]);
  
  const value = {
    orderData,
    incrementCount,
    decrementCount,
    addItem,
    subTotal,
    tax,
    platformFee,
    orderTotal
  }

  return (
    <OrderListContext.Provider value={value}>
      {children}
    </OrderListContext.Provider>
  )
}

export function useOrderList(){
  const {
    orderData,
    incrementCount,
    decrementCount,
    addItem,
    subTotal,
    tax,
    platformFee,
    orderTotal
  } = useContext(OrderListContext);
  
  return {
    orderData,
    incrementCount,
    decrementCount,
    addItem,
    subTotal,
    tax,
    platformFee,
    orderTotal
  }
}