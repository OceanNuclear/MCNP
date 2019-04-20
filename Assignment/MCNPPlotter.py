#!/home/ocean/anaconda3/bin/python3
from numpy import cos, arccos, sin, arctan, tan, pi, sqrt; from numpy import array as ary; import numpy as np; tau = 2*pi
from matplotlib import pyplot as plt
#Created to plot the variation in number of particles.
def ReadBlockOfText(fname,trigger1,length,trigger2="",ScrollMore=1):
	assert type(trigger1)==str
	assert type(trigger2)==str
	assert type(length)==int
	f=open(fname,"r")
	FastScroll, SlowScroll=True,True
	if trigger2=="":
		SlowScroll=False
	data=[]
	f.seek(0)
	while FastScroll:
		if trigger1 in f.readline():
			FastScroll=False
			#stop scrolling
	while SlowScroll:
		#keep scrolling until it reaches the column headers line
		if trigger2 in f.readline():
			SlowScroll=False
	[f.readline() for s in range(ScrollMore)] #scroll (skip) 1 more line to get to the data
	for particle in range(length):
		line=[s for s in f.readline().split() if s]#split line
		data.append(line)
	f.close()
	return data
def IsEven(Number):
	assert type(Number)==int
	if Number%2==0:
		return True
	else:
		return False
if __name__=="__main__":
	Ex3="Ex3_3000_610_thicker.out"
	Data=ReadBlockOfText(
		fname=Ex3,
		trigger1="1estimated keff results by cycle",
		length=19,
		ScrollMore=1,
	)
	Data=[ Data[n] for n in range(len(Data)) if IsEven(n) ]
	ID,kcol,srcpt_gen = ary(ary(Data).T[[1,3,11]],dtype=float)
	print((srcpt_gen/3000)/np.roll(kcol,1))

if False:
	#Check Ex3.out
	Ex3="Ex3_3000_610_thicker.out"
	TrackStats=ReadBlockOfText(fname=Ex3,
		trigger1="entering",
		length=11,
		ScrollMore=1,)[1:]
	TrackStats=ary(TrackStats).T#Convert to meaningful numbers, and erect in the proper shape such that each row con have the same type
	NewTrackStats=[]
	for i in range(len(TrackStats)):
		if i<5:
			NewTrackStats.append(ary(TrackStats[i],dtype=int))
		else:
			NewTrackStats.append(ary(TrackStats[i],dtype=float))
	ID,Cell,Enter,Population,Collisions,WeightedCollisionsPerHist,NumWeightedE,FluxWeighedE,AvgTrackWeight,MFP=NewTrackStats
	print("Population=",Population[2])
	
	#Getting the Tallies
	Tally12=ReadBlockOfText(fname=Ex3,
		trigger1="1tally  12",
		length=6,
		trigger2="energy",
		ScrollMore=0,)
	Tally22=ReadBlockOfText(fname=Ex3,
		trigger1="1tally  22",
		length=6,
		trigger2="energy",
		ScrollMore=0,)
	Flux12=Tally12[-1][1]
	Flux22=Tally22[-1][1]
	
	#Get stainless steel tank dimensions
	SSBlock=ReadBlockOfText(fname=Ex3,
		trigger1="C Stainless steel tank exterior surface",
		length=5,
		ScrollMore=0,
		)
	SSSpec=[]
	for surf in SSBlock:
		SSSpec.append(surf[3])
	SSSpec=ary(SSSpec,dtype=float)
	
	#Get Concrete Floor dimensions
	FloorBlock=ReadBlockOfText(fname=Ex3,
		trigger1="C Concrete floor",
		length=5,
		ScrollMore=0,
		)
	ConcreteSpec=[]
	for surf in FloorBlock:
		ConcreteSpec.append(surf[3])
	ConcreteSpec=ary(ConcreteSpec,dtype=float)
	x1,x2,x3,x4,dummy=ConcreteSpec#shorthands, for easier formulation below:
	x5=SSSpec[-1]-dummy
	Areas=[(x2-x1)*x5+(x4-x3)*x5,(x2-x1)*(x4-x3)]
	AvgEscapees=ary([Flux12,Flux22],dtype=float)*ary(Areas)
	
	#Get normalization factor
	NPS=ReadBlockOfText(fname=Ex3,
		trigger1="1tally fluctuation charts",
		length=1,
		trigger2="***************************",
		ScrollMore=0,)[0][8]
	Escapees=int(NPS)*AvgEscapees
	print("Escapees=",Escapees)
	print("Escaping through the:")
	print(["lateral side","lower sides"],"=")
	# print("sides")
	print(Escapees/Population[2]*100,"%")
	print(Areas)
