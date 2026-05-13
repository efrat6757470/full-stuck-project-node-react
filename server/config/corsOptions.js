const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5500',
    'http://localhost:8000',
    'http://localhost:3001',
    'https://scholarlink-zolj.onrender.com'
]

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
}

module.exports = corsOptions 