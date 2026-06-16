from agents import Agent, WebSearchTool , OpenAIChatCompletionsModel
from agents.model_settings import ModelSettings
from openai import AsyncOpenAI




INSTRUCTIONS = "You are a research assistant. Given a search term, you search the web for that term and \
produce a concise summary of the results. The summary must 2-3 paragraphs and less than 300 \
words. Capture the main points. Write succintly, no need to have complete sentences or good \
grammar. This will be consumed by someone synthesizing a report, so it's vital you capture the \
essence and ignore any fluff. Do not include any additional commentary other than the summary itself."


# hosted tools available only in openai not through github marketplace 

search_agent = Agent(
    name="Search agent",
    instructions=INSTRUCTIONS,
    tools=[WebSearchTool(search_context_size="low")],
    model="gpt-4o-mini",  # when  using openai api key
    model_settings=ModelSettings(tool_choice="required"),
)