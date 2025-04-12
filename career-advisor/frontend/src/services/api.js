import axios from 'axios';

const HUGGING_FACE_API_KEY = process.env.REACT_APP_HUGGING_FACE_API_KEY;
const HUGGING_FACE_API_URL = 'https://api-inference.huggingface.co/models';

export const getCareerAdvice = async (prompt) => {
  try {
    const response = await axios.post(
      `${HUGGING_FACE_API_URL}/gpt2`,
      {
        inputs: prompt,
        parameters: {
          max_length: 150,
          temperature: 0.7,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
        },
      }
    );
    return response.data[0].generated_text;
  } catch (error) {
    console.error('Error getting career advice:', error);
    throw error;
  }
};

export const analyzeResume = async (text) => {
  try {
    const response = await axios.post(
      `${HUGGING_FACE_API_URL}/facebook/bart-large-cnn`,
      {
        inputs: text,
      },
      {
        headers: {
          Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
        },
      }
    );
    return response.data[0].summary_text;
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw error;
  }
}; 