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
      // temperature: 0, // Higher values means the model will take more risks.
      max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      // top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      // frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      // presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    });
console.info("response.data:", response.data);
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


app.listen(3001, () => console.log('AI server started on http://localhost:3001'))