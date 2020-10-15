from django.db import models

# Create your models here.




class User(models.Model):
    email = models.CharField(primary_key=True, max_length=50)
    password = models.CharField(max_length=50)

class Sensor(models.Model):
    name = models.CharField(max_length=50) 
    ID = models.IntegerField(primary_key=True)
    alertCO = models.IntegerField()
    alertSmoke = models.IntegerField()
    alertLpg = models.IntegerField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
