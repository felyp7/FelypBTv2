if (
  message.toLowerCase().startsWith("'gpt") &&
  user["user-id"] === "162760707"
) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${args.join(" ")}`,
    });
    client.say(channel, `${completion.data}`);
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
  }

  block = true;
  setTimeout(() => {
    block = false;
  }, 5 * 1000);
}
