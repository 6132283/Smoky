from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('',views.index, name="home"),
    path('charts',views.charts, name="charts"),
    path('tables',views.tables, name="tables"),
    path('buttons',views.buttons, name="buttons"),
    path('settings', views.settings, name="settings"),
    path('',include("django.contrib.auth.urls")),

]
