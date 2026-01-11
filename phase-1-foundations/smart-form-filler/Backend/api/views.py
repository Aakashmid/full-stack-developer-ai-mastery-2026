from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .llm_client import extract_email_data



# server status view 
@api_view(["GET"])
def server_status(request):
    return Response(
        {"status": "Server is running"},
        status=status.HTTP_200_OK
    )



@api_view(["POST"])
def smart_form_filler(request):
    """
    Expects:
    {
        "email_text": "raw messy email content"
    }
    """
    email_text = request.data.get("email_text")

    if not email_text:
        print("No email_text provided in request data")
        return Response(
            {"error": "email_text is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        extracted_data = extract_email_data(email_text)
        return Response(extracted_data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {"error": "Failed to process email"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
