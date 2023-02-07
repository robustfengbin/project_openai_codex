import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

const const_openai_api_key = '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'

const configuration = new Configuration({
  apiKey: const_openai_api_key,
});


const openai = new OpenAIApi(configuration);

const app = express()
// app.use(cors())

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*")
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
//   next()
// })

app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from CodeX!'
  })
})

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    console.info('prompt;', prompt);

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0.3,
      max_tokens: 900,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
console.info("response.data=====:", response.data);
    res.status(200).send({
      bot: response.data.choices[0].text
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})


app.post('/generate_img', async (req, res) => {

  const prompt = req.body.prompt;

  console.info('generate_img prompt;', prompt);
  try {

  
  const response = await openai.createImage({
    // model: "text-davinci-003",
    prompt: prompt,
    n: 1,
    size: "1024x1024"
  });
  console.info("response", response);
  let image_url = response.data.data[0].url;
  res.status(200).send({"url": image_url, "message": "Image generated successfully"});
} catch (error) {
  if (error.response) {
    console.log(error.response.status);
    console.log(error.response.data);
  } else {
    console.log(error.message);
  }
}
})


app.listen(3000, () => console.log('AI server started on http://localhost:3000'))