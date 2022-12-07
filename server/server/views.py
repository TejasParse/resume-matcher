from rest_framework.decorators import api_view
from rest_framework.response import Response
from .src.ranker import search
import json
import requests
from django.http import StreamingHttpResponse
import os
from django.views.decorators.csrf import csrf_exempt
from django.http import FileResponse
# from django.contrib.auth.views import login_required


@api_view(['GET', 'POST'])
def find_resume(request):
    """
    List all code snippets, or create a new snippet.
    """
    if request.method == 'POST':
        # "Communication"
        try:
            print(request.data["query"])
            results = search(request.data["query"])
            res =[]
            for result in results:
                res.append(result[0])
            print(res)
            return Response({"data":"$".join(res)})
        except:
            return Response({"data":""})
    return Response("Wrong method")

@csrf_exempt 
def showfile(request):
    # handle user custom user permissions
    if request.method == "POST":
        data = request.POST
        print(data["url"])
        response = FileResponse(open(data["url"],'rb'),as_attachment=True, content_type='application/pdf')
        return response