import { signInWithPopup } from 'firebase/auth'
import React from 'react'
import { auth, googleProvider } from '../../utils/firebase'
import api from '../../utils/axios'
import { FcGoogle } from "react-icons/fc"
import { useDispatch, useSelector } from 'react-redux'
import { setUserdata } from '../redux/userSlice'
import SideBar from '../components/SideBar'
import ChatArea from '../components/ChatArea'
import Artifact from '../components/Artifact'

function Home() {
  const { userData } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const handleLogin = async (token) => {
    try {
      const { data } = await api.post("/api/auth/login", { token })
      dispatch(setUserdata(data))
    } catch (error) {
      console.log(error)
    }
  }

  const googleLogin = async () => {
    try {
      const data = await signInWithPopup(auth, googleProvider)
      const token = await data.user.getIdToken()
      await handleLogin(token)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='h-screen flex bg-[#09090f] text-white overflow-hidden'>
      <SideBar />
      <ChatArea />
      <Artifact />

      {!userData && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm'>
          <div className='w-[360px] bg-[#0e0f1a] border border-violet-500/[0.22] rounded-2xl p-7 flex flex-col gap-5 shadow-2xl shadow-violet-950/40 relative overflow-hidden'>
            <div className='absolute -top-16 -left-16 w-36 h-36 bg-violet-600/15 rounded-full blur-2xl pointer-events-none' />
            <div className='flex flex-col items-center gap-3 relative z-10'>
              <img
                src="/logo.png"
                alt="CipherVortexAI"
                className='w-14 h-14 rounded-2xl object-cover shadow-lg shadow-violet-500/30 border border-violet-500/20'
              />
              <div className='flex flex-col gap-1 text-center'>
                <h2 className='text-[18px] font-bold bg-gradient-to-r from-violet-300 via-purple-300 to-pink-300 bg-clip-text text-transparent tracking-tight'>
                  Welcome to CipherVortexAI
                </h2>
                <p className='text-[13px] text-slate-400'>
                  Please login to continue using the app.
                </p>
              </div>
            </div>

            <button
              className='w-full flex items-center justify-center gap-3 py-[11px] rounded-xl text-sm font-medium text-slate-900 bg-white hover:bg-slate-100 transition-all duration-150 cursor-pointer shadow-md'
              onClick={googleLogin}
            >
              <FcGoogle size={16} />
              Continue With Google
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
