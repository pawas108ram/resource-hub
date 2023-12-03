'use client'

import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaMinus } from "react-icons/fa";
import { MdAdd } from "react-icons/md";

const StoreProduct = ({ product,currentUserCoins }: { product: any ,currentUserCoins:number}) => {
   

    const [quantity, setQuantity] = useState(0)
    const handleAdd = () => {
        if (quantity < 5) {
            setQuantity((prev)=>prev+1)
        }

    }
    const handleMinus = () => {
        if (quantity > 0) {
            setQuantity((prev)=>prev-1)
        }

    }

    const handleBuy = async () => {
        const res = await fetch(`/api/user/buy`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ coinsToDeduct: quantity * product.coins, keysToAdd: quantity * product.keys, currentUserCoins })
        });

        if (res.ok) {
            toast.success('Product Bought')
            setQuantity(0)
            
        }
        else {
            const text = await res.text();
            toast.error(text);
        }

    }

  return (
    <div className="flex flex-col p-2 bg-white col-span-1 rounded text-black gap-2">
      <div className="bg-white  flex flex-row items-center justify-center w-full h-[300px] p-3 ">
        <Image
          src={product.imageLinks}
          width={200}
          height={200}
          alt="productImage"
          className= " w-full object-cover "
        />
          </div>
          <span className="font-medium lg:text-base xs:text-xs text-center">Number of Pendrives : { product.keys}</span>
          <span className="font-medium lg:text-base xs:text-xs text-center">Number of Coins : {product.coins}</span>
          <div className="flex flex-row items-center justify-center gap-3">
              <button className="bg-green-500 rounded-full p-3 " onClick={()=>handleAdd()} ><MdAdd /></button>
              <span>{quantity}</span>
              <button className="bg-red-500 rounded-full p-3" onClick={()=>handleMinus()}><FaMinus/></button>
          </div>
          <span className="bg-black py-2 px-4 text-white font-medium text-center rounded ">Total cost :{quantity * product.coins}</span>
          {(quantity*product.coins)>currentUserCoins ?<span className="bg-red-500 py-2 px-4 text-white font-medium text-center rounded">You dont have enough coins</span>:
         <button className="bg-blue-500  text-white font-semibold lg:text-lg xs:text-sm p-3 rounded" onClick={()=>handleBuy()}>Buy</button>}
    </div>
  );
};

export default StoreProduct;
