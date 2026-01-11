import json
from openai import OpenAI
from django.conf import settings
from decouple import config

token = config("GITHUB_TOKEN")
model_name = config("MODEL_NAME")
endpoint = config("MODEL_ENDPOINT")

client = OpenAI(
    base_url=endpoint,
    api_key=token,
)

SYSTEM_PROMPT = """
You are a data extraction engine.
Extract the following fields from the email text:
- name
- date
- action_items

Rules:
- Return ONLY valid JSON
- date must be in YYYY-MM-DD format
- action_items must be an array of strings
- If data is missing, return null
"""


def extract_email_data(email_text: str) -> dict:
    response = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT,
            },
            {
                "role": "user",
                "content": email_text,
            },
        ],
        temperature=1.0,
        top_p=1.0,
        max_tokens=1000,
        model=model_name,
    )

    ai_output = response.choices[0].message.content

    # Parse and validate JSON
    try:
        return json.loads(ai_output)
    except json.JSONDecodeError:
        print(ai_output)
        raise ValueError("Invalid JSON returned by AI")
