import React from 'react'
import Styles from './TemplateName.module.css';
import { useEffect } from 'react';
import { useState } from 'react';
export default function TemplateName() {
    const [counter, setcounter] = useState(0)
    useEffect(() => {
        console.log("TemplateName didn't mount")
    }, [])
  return (
    <div>
        <h2>TemplateName Comp</h2>
        <p>Lorem, ipsum dolor.</p>
        <p>counter : {counter}</p>
    </div>
  )
}
