const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();

const accountID = process.env.TWILIO_ACCOUNT_ID;
const tokenID= process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountID, tokenID);

const url = "https://www.amazon.co.uk/Apple-iPhone-64GB-White-Refurbished/dp/B07N9GVD8X/ref=sr_1_2?crid=1GFP2WOHJTRXM&keywords=iphone&qid=1656301719&sprefix=iphone%2Caps%2C401&sr=8-2"
const product ={
    name:'',
    price:'',
    link:''
}

const runScraper = setInterval(scarpeAmazon, 10000);
async function scarpeAmazon (){
    //fetching data
    const {data} = await axios.get(url);
    // console.log(data)

    //extracting html
    const extractor = cheerio.load(data);
    // console.log(extractor)
    const itemHolder = extractor("div#dp-container");
    // console.log(itemHolder)
    product.name = extractor(itemHolder).find('h1 span#productTitle').text();
    const price = extractor(itemHolder).find('span .a-offscreen').first().text().replace(/[$£]/g, "");
    const intPrice = parseFloat(price)
    product.link = url;
    product.price= intPrice;
    console.log(product);

    if(intPrice<300){
        client.messages.create({
            body:`Price for ${product.name} has been reduced to ${price}. Purchase it now at ${product.link}`,
            from:`${process.env.CONTACT_DETAILS}`,
            to:`${process.env.CONTACT_TO}`
        }).then(messages=>{
            console.log(messages.sid)
        }).done();
    }
}

scarpeAmazon();