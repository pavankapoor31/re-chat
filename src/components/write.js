import React, { useEffect, useState } from 'react'
import app from '../server/firebaseConfig'
import { getDatabase,ref,set,push } from 'firebase/database'
import MessageBox from './MessageBox/MessageBox'
const Write = () => {

  return (
    <div>
        <MessageBox userName={"userName"} messageTime={"messageTime"} userMessage={"userMessage"}/>
    </div>
  )
}

export default Write