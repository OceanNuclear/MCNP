#!/home/ocean/anaconda3/bin/python3
from numpy import cos, arccos, sin, arctan, tan, pi, sqrt; from numpy import array as ary; import numpy as np; tau = 2*pi
from matplotlib import pyplot as plt
#Created to plot the variation in number of particles.
def ReadBlockOfText(fname,trigger1,trigger2,length):
	assert type(trigger1)==str
	assert type(trigger2)==str
	assert type(length)==int
	fname=input("filename (without '.out')?")+".out"
	f=open(fname,"r")
	FastScroll, SlowScroll=True,True
	data=[]
	while FastScroll:
		if trigger1 in f.readline():
			FastScroll=False
			#stop scrolling
	while SlowScroll:
		#keep scrolling until it reaches the column headers line
		if trigger2 in f.readline():
			SlowScroll=False
			f.readline() #scroll 1 more line to get to the data
	for particle in range(length):
		line=[s for s in f.readline().split() if s]#split line
		data.append(line)
		print(line)
	f.close()
	return data