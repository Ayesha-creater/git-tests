#!/usr/bin/env node

import 'dotenv/config'
import express, { Request, Response } from 'express'
import { createServer } from 'http'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import morgan from 'morgan'
import { serve } from 'inngest/express'
import { config } from './config.js'
import { inngest, functions } from './inngest/index.js'
import { apiRouter } from './routes/api.routes.js'
import { logger } from './logger.js'
import recordRoutes from './routes/record.routes.js'
import cors from 'cors'

// DB Imports
import { db } from './db/index.js'
import { place } from './db/schema.js'

const nodePath = resolve(process.argv[1])
const modulePath = resolve(fileURLToPath(import.meta.url))
const isCLI = nodePath === modulePath

export default function main(port: number = config.port) {
    const app = express()
    app.use(cors())

    app.use(morgan('dev'))
    app.use(express.json())

    app.get('/', (_request: Request, response: Response) => {
        response.type('text/plain;charset=utf8')
        response.status(200).send('Olá, Hola, Hello!')
    })

    app.use('/api/inngest', serve({ client: inngest, functions }))
    app.use('/api', recordRoutes)
    app.use('/api', apiRouter)

    const server = createServer(app)

    if (isCLI) {
        server.listen(port)
        logger.info('Listening on http://localhost:%d', port)
        
        // Data Insert Function
        const seedData = async () => {
            try {
                const check = await db.select().from(place).limit(1);
                if (check.length === 0) {
                    logger.info("Inserting 15 dummy records...");
                    
                    // 15 Records ka Array
                    await db.insert(place).values([
                        { name: "Gym Plus", address: "Lahore", phone: "0300-1111111", link: "http://gym.com", rating: "4.5" },
                        { name: "Pizza Hut", address: "Karachi", phone: "0300-2222222", link: "http://pizza.com", rating: "4.2" },
                        { name: "Tech Hub", address: "Islamabad", phone: "0300-3333333", link: "http://tech.com", rating: "4.8" },
                        { name: "Coffee Club", address: "Lahore", phone: "0300-4444444", link: "http://coffee.com", rating: "4.1" },
                        { name: "Book Store", address: "Multan", phone: "0300-5555555", link: "http://books.com", rating: "3.9" },
                        { name: "Baker's Inn", address: "Faisalabad", phone: "0300-6666666", link: "http://baker.com", rating: "4.6" },
                        { name: "Car Spa", address: "Rawalpindi", phone: "0300-7777777", link: "http://carspa.com", rating: "4.3" },
                        { name: "Pet Care", address: "Peshawar", phone: "0300-8888888", link: "http://pet.com", rating: "4.7" },
                        { name: "Flower Shop", address: "Quetta", phone: "0300-9999999", link: "http://flower.com", rating: "4.4" },
                        { name: "Digital Prints", address: "Sialkot", phone: "0300-1010101", link: "http://print.com", rating: "4.0" },
                        { name: "Music Academy", address: "Gujranwala", phone: "0300-1212121", link: "http://music.com", rating: "4.9" },
                        { name: "Art Gallery", address: "Hyderabad", phone: "0300-1313131", link: "http://art.com", rating: "4.5" },
                        { name: "Dental Care", address: "Bahawalpur", phone: "0300-1414141", link: "http://dental.com", rating: "4.2" },
                        { name: "Travel Agency", address: "Sargodha", phone: "0300-1515151", link: "http://travel.com", rating: "4.6" },
                        { name: "Fitness Zone", address: "Sukkur", phone: "0300-1616161", link: "http://fit.com", rating: "4.8" }
                    ]);
                    
                    logger.info("✅ 15 Records Inserted Successfully!");
                }
            } catch (err) {
                logger.error("⚠️ DB Error: Make sure table exists (run 'npx drizzle-kit push')");
                console.error(err);
            }
        };
        
        // Run seed after 3 seconds
        setTimeout(seedData, 3000);
    }

    return server
}

if (isCLI) {
    main()
}