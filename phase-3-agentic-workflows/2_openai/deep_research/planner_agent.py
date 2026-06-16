from agents import Agent
from pydantic import BaseModel, Field
from constants import model



HOW_MANY_SEARCHES = 3  # now of searches we want to perform 

INSTRUCTIONS = f"You are a helpful research assistant. Given a query, come up with a set of web searches \
to perform to best answer the query. Output {HOW_MANY_SEARCHES} terms to query for."

# Use Pydantic to define the Schema of our response - this is known as "Structured Outputs"

class WebSearchItem(BaseModel):
    # adding reason also so that llm will choose the best search term to use for the query with the reasoning behind it
    reason: str = Field(description="Your reasoning for why this search is important to the query.")

    query: str = Field(description="The search term to use for the web search.")


class WebSearchPlan(BaseModel):
    searches: list[WebSearchItem] = Field(description="A list of web searches to perform to best answer the query.")


planner_agent = Agent(
    name="PlannerAgent",
    instructions=INSTRUCTIONS,
    model=model,  # i use here model from github marketplace as openai giving rate limit for this agent 
    output_type=WebSearchPlan,
)