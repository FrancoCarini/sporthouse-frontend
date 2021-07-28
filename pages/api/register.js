import cookie from 'cookie'
import axios from 'axios'

import { API_URL } from '@/config/index'

export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { name, email, password,  passwordConfirm } = req.body
      const backendApiRes = await axios.post(`${API_URL}/users/signup`,
        {
          name,
          email,
          password,
          passwordConfirm
        },
        { 
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      const cookieUser = {
        token: backendApiRes.data.token,
        role: backendApiRes.data.data.user.role
      }

      // Set Cookie
      res.setHeader(
        'Set-Cookie',
        cookie.serialize('user', JSON.stringify(cookieUser), {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          maxAge: 60 * 60 * 24 * 7, // 1 week
          sameSite: 'strict',
          path: '/',
        })
      )

      res.status(200).json({
        success: true,
        user: backendApiRes.data.data.user
      })
    } catch(err) {
      res.status(400).json({success: false, message: err.response.data.error})
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).json({message: `Method ${req.method} not allowed`})
  }
}
