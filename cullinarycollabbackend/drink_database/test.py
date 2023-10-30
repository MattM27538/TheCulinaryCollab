
# Import Django settings and configure Django
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "drink_database.settings")  # Replace 'projectname' with your project's name
django.setup()

# Import your Django models
from inventory.models import Drink  # Replace 'appname' with the name of your app

# Create a new drink recipe
def create_drink_recipe():
    drink = Drink(
        name="Mojito",
        ingredients="2 oz White Rum, 1 oz Lime Juice, 2 tsp Sugar, 6-8 Fresh Mint Leaves, Soda Water",
        instructions="Muddle mint and sugar in a glass. Add rum, lime juice, and ice. Top with soda water. Stir and garnish with mint sprig."
    )
    drink.save()
    print("Added a new drink recipe:", drink.name)

# Retrieve and display all drink recipes
def display_drink_recipes():
    drinks = Drink.objects.all()
    if drinks:
        print("Drink Recipes:")
        for drink in drinks:
            print(f"Name: {drink.name}")
            print(f"Ingredients: {drink.ingredients}")
            print(f"Instructions: {drink.instructions}\n")
    else:
        print("No drink recipes found.")

if __name__ == "__main__":
    create_drink_recipe()  # Add a new drink recipe
    display_drink_recipes()  # Display all drink recipes from the database
