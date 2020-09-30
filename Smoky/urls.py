from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('',views.index, name="home"),
    path('charts',views.charts, name="charts"),
    path('tables',views.tables, name="tables"),
]
