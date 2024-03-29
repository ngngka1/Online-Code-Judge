from django.shortcuts import render, HttpResponse
from django.http import JsonResponse, HttpRequest, response
from django.views.decorators.csrf import csrf_exempt
import json
import subprocess
import re
import time
from base.settings import STATIC_URL, INPUT_TEMPLATE_PATH, INPUT_FILE_PATH, OUTPUT_FILE_PATH, OUTPUT_TEMPLATE_PATH, EXECUTION_BASE_FILE_PATH
from static.codejudge_scripts.code_manager import parse_input_script

@csrf_exempt 
def run_code(request: HttpRequest):
    if request.method == "POST":
        json_data = json.loads(request.body)
        if json_data and "inputScript" in json_data:
            input_code: str = json_data["inputScript"]
            input_file_name: str = json_data["fileName"] + json_data["fileExtension"]
            if "terminalInput" in json_data:
                terminal_input: str = json_data["terminalInput"]
            else:
                terminal_input: str = ""
            parse_input_script(input_code, INPUT_TEMPLATE_PATH, INPUT_FILE_PATH)
            #### IMPORTANT: UNSAFE!! will fix after deploying to docker
            output = ""
            error = False

            result = subprocess.run(["python", STATIC_URL + EXECUTION_BASE_FILE_PATH], capture_output=True)

            if result.returncode == 0:
                output: str = result.stdout.decode("utf-8")
            else:
                # output = process.communicate()[0]
                output = hide_file_paths(result.stderr.decode("utf-8"), input_file_name)
                error = True

            return JsonResponse({"output": output, "error": error})
        else:
            return HttpResponse(status=400)
    else:
        return HttpResponse("This url is for POST request", status=400)

def update_settings(request, data):
    return HttpResponse("abcdefg")

def hide_file_paths(output: str, input_file_name: str):
    return re.sub(r"File \".+\"", input_file_name , output)
