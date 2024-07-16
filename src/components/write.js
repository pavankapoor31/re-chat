import React, { useEffect, useState } from 'react'
import app from '../server/firebaseConfig'
import { getDatabase,ref,set,push } from 'firebase/database'
const Write = () => {
    useEffect(()=>{
        const db = getDatabase(app);
        console.log(db);
    },[])
    const [inputValue,setInputValue] = useState("")
  return (
    <div>
        <input type="text" value={inputValue} onChange={(e)=>{setInputValue(e.target.value)}}/>
    </div>
  )
}

export default Write