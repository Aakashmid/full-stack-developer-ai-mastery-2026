from agents import Agent , function_tool
import os
from constants import model
from typing import Dict


# send email tool 
@function_tool
def send_html_email(subject:str,html_body: str) -> Dict[str, str]:
    try: 
        import resend

        resend.api_key = os.getenv("RESEND_API_KEY")

        params: resend.Emails.SendParams = {
        "from": "onboarding@resend.dev",
        "to": os.getenv("TO_EMAIL"),
        "subject": subject,
        "html": html_body,
        }

        email = resend.Emails.send(params)
        print(email)
        return {"status": "success"}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise

INSTRUCTIONS = """You are able to send a nicely formatted HTML email based on a detailed report.
You will be provided with a detailed report. You should use your tool to send one email, providing the 
report converted into clean, well presented HTML with an appropriate subject line."""


# email agent to send email uses send_html_email tool 
email_agent = Agent(
    name="Email agent",
    instructions=INSTRUCTIONS,
    tools=[send_html_email],
    model=model,
)
