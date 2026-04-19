import { CorsOptions } from 'cors'
import { env } from './env'

const allowedOrigins = env.CORS_ORIGINS.split(',').map((o) => o.trim())

export const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (!origin) {
            callback(null, true)
            return
        }
        if (allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error(`CORS policy: origin ${origin} is not allowed`))
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Total-Count'],
    maxAge: 86400,
}
