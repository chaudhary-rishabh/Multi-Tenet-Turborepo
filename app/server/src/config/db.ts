import mongoose from 'mongoose'
import { env } from './env'
import { logger } from './logger'

const MAX_RETRIES = 5
const RETRY_INTERVAL_MS = 5000

let retryCount = 0

async function connectWithRetry(): Promise<void> {
    try {
        await mongoose.connect(env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        })
        retryCount = 0
        logger.info('✅ MongoDB connected successfully')
    } catch (err) {
        retryCount++
        logger.error(`❌ MongoDB connection failed (attempt ${retryCount}/${MAX_RETRIES}):`, err)

        if (retryCount >= MAX_RETRIES) {
            logger.error('Max retries reached. Exiting process.')
            process.exit(1)
        }

        logger.info(`Retrying in ${RETRY_INTERVAL_MS / 1000}s...`)
        await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL_MS))
        return connectWithRetry()
    }
}

export async function connectDB(): Promise<void> {
    mongoose.set('strictQuery', true)

    mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected. Attempting to reconnect...')
    })

    mongoose.connection.on('reconnected', () => {
        logger.info('MongoDB reconnected')
    })

    mongoose.connection.on('error', (err) => {
        logger.error('MongoDB connection error:', err)
    })

    await connectWithRetry()
}

export async function disconnectDB(): Promise<void> {
    await mongoose.connection.close()
    logger.info('MongoDB connection closed gracefully')
}
