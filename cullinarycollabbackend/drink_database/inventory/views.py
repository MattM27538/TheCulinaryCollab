#from django.shortcuts import render
# Create your views here.
#from rest_framework.views import APIView
from . models import *
#from rest_framework.response import Response
from . serializer import *
from rest_framework import generics

#class DrinkView(APIView):
#    def get(self, request):
#        output = [{"name":output.name, "ingredients":output.ingredients, "instructions":output.instructions}
#                  for output in Drink.objects.all()]
#        return Response(output)
#    def post(self, request):
#        serializer = ReactSerializer(data=request.data)
#        if serializer.is_valid(raise_exception=True):
#            serializer.save()
#            return Response(serializer.data)

class DrinkView(generics.ListCreateAPIView):
    queryset = Drink.objects.all()
    serializer_class = ReactSerializer

#def create_drink_recipe(request):
 #   if request.method == 'POST':
 #       form = DrinkForm(request.POST)
  #      if form.is_valid():
  #          form.save()
   # else:
     #   form = DrinkForm()
    #return render(request, 'create_drink_recipe.html', {'form': form})
