import { OrderListProvider, useOrderList } from './OrderListLogic';
import { PlusIcon, MinusIcon } from '@radix-ui/react-icons';
import { motion, AnimatePresence, useSpring, useTransform} from 'framer-motion';
import { useEffect } from 'react';

function App() {
  return (
    <div className="max-w-[250px] mx-auto my-10">
      <OrderListProvider>
        <OrderList/>
      </OrderListProvider>
    </div>
  );
}

function OrderList() {
  
  const { orderData, subTotal, tax, platformFee, orderTotal } = useOrderList();
  
  return (
      <div>
        <ul className="flex flex-col gap-2 mb-5 h-[500px] ">
          <AnimatePresence mode='popLayout'>
            {orderData?.map(({id, count, name, price}) => (
              <OrderList.Item
                id={id}
                key={id}
                name={name}
                price={price}
                count={count}
              />
            ))}
          </AnimatePresence>
        </ul>
        <div className='text-neutral-600 text-sm border-y py-5'>
          <div className="flex items-center justify-between">
            <span>Sub Total:</span>
            <span>
              €<AnimatedNumber value={subTotal}/>
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Tax 2.5%</span>
            <span>
              €<AnimatedNumber value={tax}/>
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Platform Fee</span>
            <span>
              €<AnimatedNumber value={platformFee}/>
            </span>
          </div>
        </div>
        <div className="flex py-2 items-center justify-between">
          <span>Total</span>
          <span>
            €<AnimatedNumber value={orderTotal}/>
          </span>
        </div>
      </div>
  )
}

OrderList.Item = ({
  id,
  name,
  price,
  count
}:{
  id: number,
  name: string,
  price: number,
  count: number
}) => {

  const { incrementCount, decrementCount } = useOrderList();

  return (
    <motion.li
      layout
      initial={{opacity:0}}
      animate={{opacity:1}}
      exit={{opacity:0}}
    >
      <div
        className='p-4 border rounded-[20px]'
      >
        <div className="flex gap-2 items-center justify-between">
          <h2>
            {name}
          </h2>
          <small className='border py-1 px-4 rounded-full '>
            €{price}
          </small>
        </div>
        <div className='mt-2 flex justify-between gap-4 items-center'>
          <motion.button
            className="p-1 border rounded-full text-neutral-50 bg-blue-600"
            onClick={() => decrementCount(id)}
            whileTap={{scale:0.95}}
          >
            <MinusIcon/>
          </motion.button>
          <span
            className='flex-1 border flex items-center justify-center rounded-full '
          >{count}</span>
          <motion.button
            className="p-1  rounded-full text-neutral-50 bg-blue-600"
            onClick={() => incrementCount(id)}
            whileTap={{scale:0.95}}
          >
            <PlusIcon/>
          </motion.button>
        </div>
      </div>
    </motion.li>
  )
}

function AnimatedNumber({value}: {value:number}) {
  const spring = useSpring(value, {stiffness: 75, damping: 15, duration: 0.1});
  const display = useTransform(spring, current => {
    return current.toFixed(2);
  });

  useEffect(() => {
    spring.set(value);
  },[value]);

  return (
    <motion.span>{display}</motion.span>
  )
}

export default App;
