import axios from "axios";

const chatApi = async (messages: { role: string; content: string }[]) => {
    const apiKey = "***REMOVED***"; // Replace with your key

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4",
                messages,
                temperature: 0.7,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error with ChatGPT API:", error);
        throw error;
    }
};

export default chatApi;
