from django.shortcuts import render

from django.http import HttpResponse
from django.shortcuts import render


def index(request):
    return render(
        request,
        'Smoky/hello_world.html',

    )

def charts(request):
    return render(
        request,
        'otherpages/charts.html',

    )

def tables(request):
    return render(
        request,
        'otherpages/tables.html',

    )

def connessionephp(request):
    return render(
        request,
        'otherpages/data.php',

    )
