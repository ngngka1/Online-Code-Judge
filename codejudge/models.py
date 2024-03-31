from django.db import models

class Problem(models.Model):
    title = models.CharField(max_length=200, primary_key=True) # title of the problem
    description = models.CharField(max_length=1000) # description of the problem
    exampleTestcases = models.TextField(default="") # a stringified JSON, which contains the example
    # testcases and the expected output in the following format:
    # [{"testcase1": "some string", "output1": "some string"}, {"testcase2": "some string", "output2": "some string"}]
    expectedOutputType = models.CharField(max_length=50) # expected type of the output
    
    def __str__(self): 
        return self.title 
    
