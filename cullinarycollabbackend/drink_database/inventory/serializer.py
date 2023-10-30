from rest_framework import serializers
from .models import *

class ReactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Drink
        fields = ['name', 'ingredients', 'instructions']


