import { Button, Image, TextArea } from 'gestalt';
import { useState } from 'react';

const HOST = 'https://ai.elliottwen.info';
const SECRET =
  'c0957e34a11786192e8819a7d4faef725c3a0becf05716823b30e37111196e92ba1953a695dddd761cce8abbffefce40da8059d06aa651a02f9cc3322a7d1e0b';
/**
 * This a secret page for internal use only
 * @returns
 */
async function callAuth() {
  const request = await fetch(`${HOST}/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: SECRET,
    },
  });
  const response = await request.json();
  return response;
}

async function callGenerateImage(signature, prompt) {
  const request = await fetch(`${HOST}/generate_image`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: SECRET,
    },
    body: JSON.stringify({
      signature,
      prompt,
    }),
  });
  const response = await request.json();
  return response;
}

function ImageGenerationPage() {
  const [imageUrl, setImageUrl] = useState(null);
  const [prompt, setPrompt] = useState('a dog in a field of flowers');

  async function rock() {
    const authResponse = await callAuth();
    console.log({ authResponse });

    const imageResponse = await callGenerateImage(
      authResponse.signature,
      prompt,
    );
    console.log({ imageResponse });

    setImageUrl(`${HOST}/${imageResponse}`);
  }
  return (
    <>
      <h1>This is Picture generation page</h1>

      <TextArea
        id="text-area-prompt"
        placeholder="Type here..."
        helperText="Type a prompt to generate an image"
        onChange={({ value }) => setPrompt(value)}
        value={prompt}
        rows={5}
        cols={50}
        // maxLength={100}
        disabled={false}
      ></TextArea>

      <Button onClick={rock} text={'Generate Image'}></Button>
      {imageUrl && <Image src={imageUrl} alt="Generated" />}
    </>
  );
}

export default ImageGenerationPage;
