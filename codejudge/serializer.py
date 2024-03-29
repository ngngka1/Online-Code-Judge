# import serializer from rest_framework 
from rest_framework import serializers 
  
# import model from models.py 
from .models import Problem 
  
# Create a model serializer  
class ProblemSerializer(serializers.ModelSerializer): 
    # specify model and fields 
    class Meta: 
        model = Problem 
        fields = "__all__"