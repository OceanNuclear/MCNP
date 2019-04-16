#!/home/ocean/anaconda3/bin/python3
from numpy import cos, arccos, sin, arctan, tan, pi, sqrt; from numpy import array as ary; import numpy as np; tau = 2*pi
from matplotlib import pyplot as plt

def rootSumSq(l):
	return sqrt(np.sum(ary([i**2 for i in l])))
def InCircle(xyz,x0,y0,r):
	#Given a string of (x,y,z), check if (x, y) falls within a distance of r away from (x0,y0)
	x,y,z=ary(xyz.split(),dtype=float)
	dx,dy=[x-x0,y-y0]
	dist=rootSumSq([dx,dy])
	return dist<=r
def MCNPCirc(xyz):
	r=7.5; s=20
	c11=InCircle(xyz,-s,0, r)
	c12=InCircle(xyz, s,0, r)
	c13=InCircle(xyz, 0,-s,r)
	c14=InCircle(xyz, 0, s,r)
	c15=InCircle(xyz, 0, 0,r)
	return [c11,c12,c13,c14,c15]
def ParticleLocationDictGenerator(xyz):
	names=["c11","c12","c13","c14","c15"]
	present=MCNPCirc(xyz)
	dictionary = dict(zip(names,present))
	numCirc=np.sum(list(dictionary.values()))
	if numCirc<1:
		raise ValueError("Doesn't fall into any of the bin!")
	elif numCirc>1:
		raise ValueError("Falls into multiple bins!")
	return dictionary
def GetLocation(xyz):
	dictionary=ParticleLocationDictGenerator(xyz)
	loc_name=list(dictionary.keys())
	present=list(dictionary.values())
	for i in range(len(dictionary)):
		if present[i]:
			return loc_name[i]

if __name__=="__main__":
	fname=input("filename (without '.out')?")+".out"
	f=open(fname,"r")
	Found50ParticleTables, FoundColHeader=False,False
	x,y,z=[],[],[]
	while (Found50ParticleTables==False):
		if "print table 110" in f.readline():
			Found50ParticleTables=True
			#stop scrolling
	while (FoundColHeader==False):
		#keep scrolling until it reaches the column headers line
		if "nps    x" in f.readline():
			FoundColHeader=True
			f.readline() #scroll 1 more line to get to the data
	for particle in range(50):
		line=[s for s in f.readline().split() if s]
		x.append(line[1])
		y.append(line[2])
		z.append(line[3])
		xyz=" ".join(line[1:4])
		print(GetLocation(xyz))
	f.close()