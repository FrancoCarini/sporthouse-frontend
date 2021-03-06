import cookie from 'cookie'
import {API_URL} from '@/config/index'

export default async (req, res) => {
  if (req.method === 'GET') {
    if (!req.headers.cookie) {
      res.status(403).json({message: 'Not authorized'})
      return
    }

    const cookies = cookie.parse(req.headers.cookie)
    const user = JSON.parse(cookies.user)

    const backendApiRes = await fetch(`${API_URL}/users/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    })
    
    const data = await backendApiRes.json()

    if (data.success) {
      res.status(200).json({user: data.user})
    } else {
      res.status(403).json({message: 'User forbidden'})
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).json({message: `Method ${req.method} not allowed`})
  }
}