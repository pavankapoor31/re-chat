import React from 'react'
import useFirebaseAuth from '../../hooks/useFirebaseAuth'
import signoutIcon from './../../assets/images/signout-icon.png';
import { Tooltip } from '@mui/material';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../server/firebaseConfig';
import { get, push, ref, remove, set, update } from 'firebase/database';
const Navbar = () => {
    const {loading,currentUser} = useFirebaseAuth();
    const handleSignOut = async()=>{
        // handles signout from firebase
        const dbRef = ref(db,'chatrooms')
        const snapshot = await get(dbRef);
        const snapshotValues = snapshot.val();
        Object.entries(snapshotValues).forEach(([key,value])=>{
            if(value.createdBy===currentUser.uid){
                    const updateRef = ref(db, `chatrooms/${key}`);
                    update(updateRef,{"disabled":true});
            }
        })
        signOut(auth);

    }
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light px-2" >
            <a className="navbar-brand" href="/welcome">Re-chat</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item active">
                        <a className="nav-link" href="#">Home <span className="sr-only"></span></a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link disabled" href="#">Features</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link disabled" href="#">Pricing</a>
                    </li>
                </ul>
            </div>
           { currentUser &&  <div className='px-2'>
               <div className="d-flex align-items-center">
               <div>{currentUser.firstName} {currentUser.lastName} </div>
                <Tooltip  title="Sign out" arrow placement='bottom'>
                 <div  type="button" className='px-2 pb-1 cursor-pointer' onClick={handleSignOut}><img src={signoutIcon} alt="Sign out icon" width={"18px"} height={"18px"} /></div>
                </Tooltip>
               </div>
            </div>
            }
        </nav>
    )
}

export default Navbar