from django.shortcuts import render, HttpResponse
from django.http import JsonResponse, HttpRequest, response
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
import json
import subprocess
import re
import time
from base.settings import STATIC_URL, INPUT_TEMPLATE_PATH, INPUT_FILE_PATH, OUTPUT_FILE_PATH, OUTPUT_TEMPLATE_PATH, EXECUTION_BASE_FILE_PATH
from static.codejudge_scripts.code_manager import parse_input_script

def inputSanitization(): # wip
    pass

@csrf_exempt 
def runCode(request: HttpRequest):
    """ this function run the code snippet passed in the POST request body

    POST request json body:
        "inputScript": (str) The code snippet that is to be executed
        "fileName": (str) The file name of the code snippet to be executed (simply used for error prompt)
        "fileExtension": (str) The file extension, will be used for distinguishing the programming language 
        "terminalInput": (optional) (str) The input in terminal (supports interactive input)
    """
    if request.method == "POST":
        json_data = json.loads(request.body)
        if json_data and "inputScript" in json_data:
            input_code: str = json_data["inputScript"]
            inputFileName: str = json_data["fileName"] + json_data["fileExtension"]
            if "terminalInput" in json_data:
                terminalInput: str = json_data["terminalInput"]
            else:
                terminalInput: str = ""
            parse_input_script(input_code, INPUT_TEMPLATE_PATH, INPUT_FILE_PATH)
            #### IMPORTANT: UNSAFE!! will fix after deploying to docker
            result = runSubprocess(["python", STATIC_URL + EXECUTION_BASE_FILE_PATH], terminalInput, 3, inputFileName)

            if "output" not in result or "statusCode" not in result:
                return HttpResponse(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return JsonResponse({"output": result["output"]}, status=result["statusCode"]) # for some reason http 100 doesnt work in front end
        else:
            return HttpResponse(status=status.HTTP_400_BAD_REQUEST)
    else:   
        return HttpResponse("This endpoint should only receive POST request!", status=status.HTTP_400_BAD_REQUEST)

def updateSettings(request, data):
    return HttpResponse("abcdefg")

def hideFilePaths(output: str, input_file_name: str):
    return re.sub(r"File \".+\"", input_file_name , output)

def runSubprocess(terminalCommand, terminalInput: str, timeout: int, inputFileName):
    responseJson = {"output": "", "statusCode": status.HTTP_200_OK}
    try:
        # Start the subprocess
        process = subprocess.Popen(terminalCommand, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, encoding="utf-8", errors="ignore")
        stdout, stderr = process.communicate(input=terminalInput if terminalInput else None, timeout=timeout)
        # print("type of stdout =", type(stdout))
        # print(stdout)
        # print("type of stderr =", type(stderr))
        # print(stderr)
        
    except subprocess.TimeoutExpired:
        stdout = process.stdout.read()
        process.kill()
        stderr = process.stderr.read()
        responseJson["output"] = stdout + stderr
        responseJson["statusCode"] = status.HTTP_504_GATEWAY_TIMEOUT
        return responseJson
    except Exception as e:
        # Handle other exceptions
        responseJson["output"] = "An unknown server side error occured"
        responseJson["statusCode"] = status.HTTP_500_INTERNAL_SERVER_ERROR
        return responseJson
    
    if not stderr:
        responseJson["output"] = stdout
    elif stderr.endswith("EOFError: EOF when reading a line\n"):
        responseJson["output"] = stdout
        responseJson["statusCode"] = status.HTTP_206_PARTIAL_CONTENT
    else:
        responseJson["output"] = stdout + hideFilePaths(stderr, inputFileName)
    return responseJson
    
    
# tests
# print(1)
# print(input("input a letter"))
# print(3)
# print(input("input a letter"))
# print(5)
