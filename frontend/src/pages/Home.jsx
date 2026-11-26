import { signInWithPopup } from 'firebase/auth'
import React from 'react'
import { auth, googleProvider } from '../../utils/firebase'
import api from '../../utils/axios'
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from 'react-redux';
import { setUserdata } from '../redux/userSlice';
import SideBar from '../components/SideBar';
import ChatArea from '../components/ChatArea';
import Artifact from '../components/Artifact';

function Home() {
    const {userData}=useSelector(state=>state.user)
    const dispatch=useDispatch()
    const handleLogin = async (token) => {
        try {
            const { data } = await api.post("/api/auth/login", { token })
            dispatch(setUserdata(data))
        } catch (error) {
            console.log(error)
        }
    }


    const googleLogin = async () => {
        const data = await signInWithPopup(auth, googleProvider)
        const token = await data.user.getIdToken()
        console.log(token)
        await handleLogin(token)
        console.log(data)
    }
    return (
        <div className='h-screen flex bg-[#0a0b12] text-white overflow-hidden'>

<SideBar/>
<ChatArea/>
<Artifact/>




{!userData &&   <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur'>
                <div className='w-[360px] bg-[#0e0f1a] border border-violet-500/[0.18] rounded-2xl p-7 flex flex-col gap-5 shadow-2xl shadow-violet-900/30'>
                    <div className='flex flex-col items-center gap-3'>
                        <img src="/logo.png" alt="CipherVortexAI" className='w-14 h-14 rounded-2xl object-cover shadow-lg shadow-violet-500/30' />
                        <div className='flex flex-col gap-1 text-center'>
                          <h2 className='text-[18px] font-bold bg-gradient-to-r from-violet-300 via-purple-300 to-pink-300 bg-clip-text text-transparent tracking-tight'>Welcome to CipherVortexAI</h2>
                          <p className='text-[13px] text-slate-500'>Please login to continue using the app.</p>
                        </div>
                    </div>
                    <button className='w-full flex items-center justify-center gap-3 py-[11px] rounded-xl text-sm font-medium text-black/90 bg-white hover:bg-gray-100 transition-all duration-150 cursor-pointer' onClick={googleLogin}>
                        <FcGoogle size={15} />
                        Continue With Google
                    </button>
                </div>
            </div>}
          
        </div>
    )
}

export default Home
