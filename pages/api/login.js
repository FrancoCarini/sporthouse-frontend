import cookie from 'cookie'
import { API_URL } from '@/config/index'

export default async (req, res) => {
  if (req.method === 'POST') {
    const {email, password} = req.body

    const backendApiRes = await fetch(`${API_URL}/users/login`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        email,
        password
      })
    })

    const data = await backendApiRes.json()

    const cookieUser = {
      token: data.token,
      role: data.data.user.role
    }

    if (data.success) {
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
        user: data.data.user
      })
    } else {
      res.status(401).json({success: false, message: data.error})
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).json({message: `Method ${req.method} not allowed`})
  }
}
