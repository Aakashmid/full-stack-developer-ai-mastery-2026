from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
from crewai_tools import SerperDevTool


@CrewBase
class FinancialResearcher():
    """FinancialResearcher crew"""

    agents: list[BaseAgent]
    tasks: list[Task]

    agents_config = 'config/agents.yaml'
    tasks_config = 'config/tasks.yaml'

    @agent
    def analyst(self)-> Agent:
        return Agent(config =self.agents_config['analyst'] ) # type: ignore[index]    
    
    @agent
    def researcher(self)-> Agent:
        return Agent(config = self.agents_config['researcher']  , verbose = True , tools=[SerperDevTool()]) # type: ignore[index]    
    
    @task
    def research_task(self)-> Task:
        return Task(config = self.tasks_config['research_task'])  # type: ignore[index]    
    
    @task
    def analysis_task(self)-> Task:
        return Task(config = self.tasks_config['analysis_task'])  # type: ignore[index]    
    
    @crew
    def crew(self) -> Crew:
        """Creates the financial_research crew"""
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True,
        )
