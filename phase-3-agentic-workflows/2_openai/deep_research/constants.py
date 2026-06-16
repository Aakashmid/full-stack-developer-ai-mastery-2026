from dotenv import load_dotenv
from openai import AsyncOpenAI
from agents import OpenAIChatCompletionsModel
import os

load_dotenv(override=True)


openai_client = AsyncOpenAI(base_url=os.getenv("GITHUB_BASE_URL"), api_key=os.getenv("GITHUB_TOKEN"))

model = OpenAIChatCompletionsModel(model="gpt-4o-mini", openai_client=openai_client)
