from django.db import models

# Create your models here.

class Drink(models.Model):
    name = models.CharField(max_length=255)
    ingredients = models.TextField()
    instructions = models.TextField()

#    def __str__(self):
#        return self.name
