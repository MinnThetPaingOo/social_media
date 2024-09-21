const express = require('express')
const morgan = require('morgan')
require('dotenv').config()
const mongoose = require('mongoose')
const cors = require('cors')
const multer = require('multer')
const cookieParser = require('cookie-parser')
const authRoute = require('./routes/authRoute')
const userRoute = require('./routes/userRoute')
const postRoute = require('./routes/postRoute')
const adminRoute = require('./routes/adminRoute')

const NotificationRoute = require('./routes/notificationRoute')
const postModel = require('./models/postModel')


const app = express()
app.use(express.static('public'))
mongoose.set('debug', true);
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("connect to db")
        app.listen(process.env.PORT, () => {
            console.log("server is running at " + process.env.PORT)
        })
    })
    .catch(err => console.error('MongoDB connection error:', err));

app.use(cors(
    {
        origin: "http://localhost:3006",
        credentials: true
    }
))
app.use(express.json())
app.use(express.static('uploads'))
app.use(morgan('dev'))
app.use(cookieParser())

//routes
app.get('/', (req, res) => {
    return res.json({ "hello": "hello world 12345" })
})

app.use(NotificationRoute)
app.use(authRoute)
app.use(userRoute)



//storage

// app.post('/upload', (req, res) => {
//     const storage = multer.diskStorage({
//         destination: "uploads",
//         filename: function (req, file, cb) {
//             cb(null, file.originalname)
//         }
//     })
//     const upload = multer({ storage: storage }).single('testImage')
//     upload(req, res, (err) => {
//         if (err) {
//             console.log(err)
//         } else {
//             const newPost = new postModel({
//                 text: req.body.text,
//                 img: {
//                     data: req.file.filename,
//                     contentType: 'image/png'
//                 }
//             })
//             newPost.save()
//             res.send(newPost)
//         }
//     })
// })

app.use(postRoute)
app.use(adminRoute)

