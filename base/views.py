from django.shortcuts import render
from django.http import JsonResponse
from agora_token_builder import RtcTokenBuilder
from .models import RoomMember
import random
import time,json
from django.views.decorators.csrf import csrf_exempt

# Create your views here.

def getToken(request):
    appId = '5184dff46f5349428b4cec8530acddcb'
    appCertificate = '6182b495e5fd406a8cb26891e3e9afb0'
    channelName = request.GET.get('channel')
    uid = random.randint(1,230)
    expirationTimeInSeconds = 3600 * 24 # (24 hours in second)
    currentTimeStamp = time.time()
    privilegeExpiredTs = currentTimeStamp + expirationTimeInSeconds
    role = 1
    
    token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs)
    return JsonResponse({'token':token, 'uid':uid}, safe=False)

def lobby(request):
    return render(request, 'base/lobby.html')

def room(request):
    return render(request, 'base/room.html')

@csrf_exempt
def createMember(request):
    data = json.loads(request.body)
    
    member, created = RoomMember.objects.get_or_create(
        name = data['name'],
        uid = data['UID'],
        room_name = data['room_name']
    )
    
    return JsonResponse({'name':data['name']}, safe=False)

def getMember(request):
    uid = request.GET.get('uid')
    room_name = request.GET.get('room_name')
    
    member = RoomMember.objects.get(
        uid = uid,
        room_name = room_name
    )
    name = member.name
    return JsonResponse({'name':member.name}, safe=False)

@csrf_exempt
def deleteMember(request):
    data = json.loads(request.body)
    
    member = RoomMember.objects.get(
        name = data['name'],
        uid = data['UID'],
        room_name = data['room_name']
    )
    member.delete()
    return JsonResponse("Member was deleted", safe=False)