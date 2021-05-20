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

    // httpOnly true lo que hace es que solo el server pueda leer esta Cookie. El browser no puede. 
    // Si vamos al browser y hacemos en la consola document.cookie vamos a ver que no encuentra nada
    if (data.success) {
      // Set Cookie
      res.setHeader(
        'Set-Cookie',
        cookie.serialize('token', data.token, {
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
