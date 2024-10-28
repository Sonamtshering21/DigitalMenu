"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const ItemDeails = ({ params }) => {
  console.log(params);
  const [Data, setData] = useState("");
  let id = params.id;

  useEffect(() => {
    const getData = (val) => {

        //api call id

        //api return
        setData(val)
    };
    getData(id)
  }, [id]); //added id
  return <div>
    <Link href={`/menu/moredetails/${id}`}>more</Link>
    {Data}
  </div>;
};

export default ItemDeails;
