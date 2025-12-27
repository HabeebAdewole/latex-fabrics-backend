import Redis from 'ioredis';
import {createClient, RedisClientType} from 'redis';
import dotenv from 'dotenv';
dotenv.config();


class RedisConfig {
    private static instance: RedisConfig;
    private client: RedisClientType;

    private constructor() {
        this.client = createClient({
            url: process.env.REDIS_URL || 'redis://localhost:6379',
        });
        this.client.on('connect', ()=> {
            console.log('redis is online');
        });
        this.client.on('error', (err) => {
            console.error('Redis Client Error', err);
        });
    }
    // Singleton pattern to ensure only one instance of RedisConfig
    //converted the instance from private to public
    static getInstance(): RedisConfig {
        if (!RedisConfig.instance) {
            RedisConfig.instance = new RedisConfig();
        }
        return RedisConfig.instance;
    }
    public async connect(): Promise<void> {
    await this.client.connect();
  }

  
  public getClient(): RedisClientType {
    return this.client;
  }
}
export const redisConfig = RedisConfig.getInstance();
export const getRedisClient = () => redisConfig.getClient();
