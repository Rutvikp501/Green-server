
const express = require('express');
const app = express()
const http = require("http").createServer(app);
const cors = require('cors');
app.use(cors())
const swaggerUI = require('swagger-ui-express');
const YAML = require("yamljs");
const path = require("path");
//importing routes
const { productRouter } = require('./src/Routes/product.routes');
const { cartRouter } = require('./src/Routes/cart.routes');
const { orderRouter } = require('./src/Routes/order.routes');
const bodyParser = require('body-parser');
const { categoryRouter } = require('./src/Routes/category.routes');
const { stripeRouter } = require('./src/Routes/stripe.routes');
const { userRouter } = require('./src/Routes/user.routes')

const connectDB = require("./src/config/DB.js");
const port = 5001

app.use('/stripe/webhooks', bodyParser.raw({ type: '*/*' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));




//ejs config
app.set("views", path.join("views"));
app.set("view engine", "ejs");

//swagger config
const swaggerDocument = YAML.load(path.join(__dirname, './swagger.yaml'));
app.use('/sgr', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use(express.json())
app.use('/stripe', stripeRouter)

app.get('/', (req, res) => {
    res.status(200).send('Welcome homepage')
})

app.get('/test', (req, res) => {
    res.status(200).send('test page')
})




app.use('/user', userRouter)
app.use('/product', productRouter)
app.use('/cart', cartRouter)
app.use('/orders', orderRouter)
app.use('/category', categoryRouter)

app.get("*", (req, res) => {
    res.status(200).send('Page Note Found')
    
})
app.listen(port, async () => {
    try {
        await connectDB()

    } catch (error) {
        console.log(error);
    }
    console.info(
        `Server is running on port ${port}`
    );
});

