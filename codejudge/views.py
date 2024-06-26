from django.shortcuts import render, HttpResponse
from django.http import JsonResponse, HttpRequest, response
from django.views.decorators.csrf import csrf_exempt
from django.core import serializers
from .serializer import ProblemSerializer
from rest_framework import status
from .models import Problem
import json
import subprocess
import re
from base.settings import STATIC_URL, INPUT_TEMPLATE_PATH, INPUT_FILE_PATH, OUTPUT_FILE_PATH, OUTPUT_TEMPLATE_PATH, EXECUTION_BASE_FILE_PATH
from static.codejudge_scripts.code_manager import parse_input_script

@csrf_exempt 
def runCode(request: HttpRequest):
    """ this function run the code snippet passed in the POST request body

    POST request json body:
        "inputScript": (str) The code snippet that is to be executed
        "fileName": (str) The file name of the code snippet to be executed (simply used for error prompt)
        "fileExtension": (str) The file extension, will be used for distinguishing the programming language
        "testcases: (List[])
    """
    if request.method == "POST":
        json_data = json.loads(request.body)
        if json_data and "inputScript" in json_data and "testcases" in json_data:
            input_code: str = json_data["inputScript"]
            testcases = json_data["testcases"]
            input_file_name: str = json_data["fileName"] + json_data["fileExtension"]
            parse_input_script(input_code, INPUT_TEMPLATE_PATH, INPUT_FILE_PATH)#### IMPORTANT: UNSAFE!! will fix after deploying to docker
            output = ""
            error = False

            result = subprocess.run(["python", STATIC_URL + EXECUTION_BASE_FILE_PATH], capture_output=True)

            if result.returncode == 0:
                output: str = result.stdout.decode("utf-8")
            else:
                output = hideFilePaths(result.stderr.decode("utf-8"), input_file_name)
                error = True

            return JsonResponse({"output": output, "error": error})
    return HttpResponse("Invalid JSON data", status=status.HTTP_400_BAD_REQUEST)

def submitCode(request: HttpRequest):
    pass

def getProblem(request: HttpRequest, problem_title: str):
    if request.method == "GET":
        problem = Problem.objects.filter(title=problem_title)
        if not problem.exists():
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)
        else:
            problem = problem[0]
            json_data = json.loads(serializers.serialize("json", [problem]))[0]["fields"]
            json_data["title"] = problem_title
            json_data["exampleTestcases"] = json.loads(json_data["exampleTestcases"])
            return JsonResponse(json_data)
    else:
        return HttpResponse(status=status.HTTP_400_BAD_REQUEST)
    
def getProblemsList(request: HttpRequest):
    if request.method == "GET":
        problems = Problem.objects.all()
        if not problems.exists():
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)
        else:
            json_data = {}
            json_data["problemTitles"] = list(problem.title for problem in problems)
            return JsonResponse(json_data)
    else:
        return HttpResponse(status=status.HTTP_400_BAD_REQUEST)
        
@csrf_exempt
def createProblem(request: HttpRequest):
    """ Create a coding problem 

    POST request json body:
        "title": (str) title of the coding problem
        "description": (str) description of the problem
        "exampleTestcases": (list | str) a list of example testcases and output in the following format:
        [
            {"input": "some string1", "output": "some string1"}, 
            {"input": "some string2", "output": "some string2"}
        ]
        "expectedOutputType": (optional) (str) expected output type
    """
    ## before running this, should check the auth of the requester
    if request.method == "POST":
        json_data = json.loads(request.body)
        if json_data:
            if "exampleTestcases" in json_data and type(json_data["exampleTestcases"]) is list:
                json_data["exampleTestcases"] = json.dumps(json_data["exampleTestcases"])
            serializer = ProblemSerializer(data=json_data)
            if serializer.is_valid():
                serializer.save()
                return HttpResponse(status=status.HTTP_200_OK)
    return HttpResponse(status=status.HTTP_400_BAD_REQUEST)
    
@csrf_exempt            
def updateProblem(request: HttpRequest, problem_title: str):
    if request.method == "PUT":
        json_data = json.loads(request.body)
        target_problem = Problem.objects.get(title=problem_title)
        if json_data:
            if "exampleTestcases" in json_data and type(json_data["exampleTestcases"]) is list:
                json_data["exampleTestcases"] = json.dumps(json_data["exampleTestcases"])
            serializer = ProblemSerializer(target_problem, data=json_data)
            if serializer.is_valid():
                serializer.update(target_problem, json_data)
                return HttpResponse(status=status.HTTP_200_OK)
    return HttpResponse(status=status.HTTP_400_BAD_REQUEST)

def updateSettings(request: HttpRequest):
    return HttpResponse("abcdefg")
            
def hideFilePaths(output: str, input_file_name: str):
    return re.sub(r"File \".+\"", input_file_name , output)

