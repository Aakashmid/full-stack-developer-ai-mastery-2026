"""
send data to OpenAI (GPT-4) or Anthropic (Claude) via Python and parse the JSON response. (using GitHub Models API)
"""

import os
import json
import openai
from dotenv import load_dotenv

# GitHub Models uses OpenAI-compatible API
load_dotenv()

# Prefer a GitHub token for GitHub Models, fall back to an OpenAI-style key
token = os.getenv("GITHUB_TOKEN") 
endpoint = "https://models.github.ai/inference"
model = "openai/gpt-4.1"

if not token:
    raise RuntimeError(
        "API key not found. Set the GITHUB_TOKEN or OPENAI_API_KEY environment variable."
    )



client = openai.OpenAI(
    base_url=endpoint,
    api_key=token,
)
def call_ai_and_parse_json(
    system_prompt: str,
    user_input: str,
    temperature: float = 0,
    max_tokens: int = 500,
):
    """
    Sends data to a GitHub Marketplace AI model
    and returns parsed JSON safely.
    """

    response = client.chat.completions.create(
        model=model,
        messages=[
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": user_input
            }
        ],
        temperature=temperature,
        max_tokens=max_tokens
    )

    raw_output = response.choices[0].message.content.strip()

    try:
        return json.loads(raw_output)
    except json.JSONDecodeError:
        raise ValueError(
            f"Invalid JSON returned by model:\n{raw_output}"
        )




if __name__ == "__main__":
    system_prompt = (
        "You are an AI assistant that helps with data processing. "
        "Respond only with valid JSON."
    )

    user_input=""
    while(user_input.strip() != "exit"):
        user_input = input("Enter your request: ")
        try:
            result = call_ai_and_parse_json(system_prompt, user_input)
            print("Parsed JSON output:", result)
        except ValueError as e:
            print(e)