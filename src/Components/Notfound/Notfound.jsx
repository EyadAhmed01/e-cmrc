import React from 'react'
import { useEffect } from 'react';
import Styles from './Notfound.module.css';
import { useState } from 'react';
export default function Notfound() {
    const [counter, setcounter] = useState(0)
    useEffect(() => {
        console.log("Notfound didn't mount")
    }, [])
  return (
    <div>
        <h2>Notfound Comp</h2>
        <p>Lorem, ipsum dolor.</p>
        <p>counter : {counter}</p>
    </div>
  )
}
