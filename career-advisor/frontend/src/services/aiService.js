import axios from 'axios';

const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const API_URL = 'https://api.openai.com/v1/chat/completions';

if (!API_KEY) {
  console.error('OpenAI API key is not set in environment variables');
}

const generatePrompt = (answers) => {
  return `Based on the following career assessment answers, provide detailed suggestions for:
1. Skills to develop
2. Job market opportunities
3. Career path recommendations
4. Resume improvement tips
5. Networking strategies

Assessment Answers:
${JSON.stringify(answers, null, 2)}

Please provide specific, actionable recommendations for each section.`;
};

export const getCareerSuggestions = async (answers) => {
  try {
    if (!API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }

    console.log('Sending request to OpenAI with answers:', answers);
    
    const response = await axios.post(
      API_URL,
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a career advisor providing personalized career guidance based on assessment answers."
          },
          {
            role: "user",
            content: generatePrompt(answers)
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        }
      }
    );

    console.log('OpenAI response:', response.data);
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    throw new Error(`AI Service Error: ${error.response?.data?.error?.message || error.message}`);
  }
};

export const parseSuggestions = (aiResponse) => {
  try {
    const sections = {
      skills: '',
      jobMarket: '',
      careerPath: '',
      resume: '',
      network: ''
    };

    const lines = aiResponse.split('\n');
    let currentSection = '';

    lines.forEach(line => {
      if (line.toLowerCase().includes('skills')) {
        currentSection = 'skills';
      } else if (line.toLowerCase().includes('job market')) {
        currentSection = 'jobMarket';
      } else if (line.toLowerCase().includes('career path')) {
        currentSection = 'careerPath';
      } else if (line.toLowerCase().includes('resume')) {
        currentSection = 'resume';
      } else if (line.toLowerCase().includes('network')) {
        currentSection = 'network';
      } else if (currentSection && line.trim()) {
        sections[currentSection] += line + '\n';
      }
    });

    return sections;
  } catch (error) {
    console.error('Error parsing AI suggestions:', error);
    throw new Error('Failed to parse AI suggestions');
  }
}; 