from django.shortcuts import render
from django.http import JsonResponse
from agora_token_builder import RtcTokenBuilder

# Create your views here.

def getToken(request):
    token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs)
    return 

def lobby(request):
    return render(request, 'base/lobby.html')

def room(request):
    return render(request, 'base/room.html')
