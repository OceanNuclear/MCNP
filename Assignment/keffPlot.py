#!/home/ocean/anaconda3/bin/python3
from numpy import cos, arccos, sin, arctan, tan, pi, sqrt; from numpy import array as ary; import numpy as np; tau = 2*pi
from matplotlib import pyplot as plt
from MCNPPlotter import *

fname="Ex3_5000_500.out"
namelist=["cycle","histories","k(coll)","k(abs)","k(track)","k(coll)_avg","st-dev_(coll)","k(abs)_avg","st-dev_(abs)","k(track)_avg","st-dev_(track)","k(c/a/t)_com","st-dev_(c/a/t)","fom"]

def matching(name):
	mathcinglist=[]
	for checked_name in namelist:
		if "_" in checked_name:
			if name in checked_name:


				if "k" in checked_name:
					mathcinglist.append(checked_name)
				elif "st-dev" in checked_name:
					mathcinglist.append(checked_name)
	return mathcinglist

def PlotOnek_eff(keffs, name,ax=plt):
	#Find the keff with the (name) inside the bracket AND has an "_" in its name, and then find the st-dev(name)
	k,std=matching(name)
	
	#get the cycle number and plot the mean keff value of interest
	cycle=keffs[namelist[0]]
	ax.plot(cycle,keffs[k],label=name)
	
	#get the lower to upper limits
	llim=keffs[k]-keffs[std]
	ulim=keffs[k]+keffs[std]
	
	#plot the confidence interval as promised.
	ax.fill_between(cycle,llim,ulim,alpha=0.3,)#label=r"$1 \sigma$ confidence",)

if __name__=="__main__":
	#Read the data,
	keffs=ReadBlockOfText(fname,
		trigger1="1individual and average keff estimator results by cycle",
		ScrollMore=18,
		length=535
	)
	#Clean the data
	keffs=[line for line in keffs if not ("----" in line[0]) ]#clean vertical data separators which occurs every 10 cycles.
	for _ in range(3):
		[line.remove("|") for line in keffs] #clean away all the non-data visual separator symbols
	#Convert them to a dictionary
	keffs=ary(keffs).T
	keffs=ConvToDict(keffs,namelist)
	#Clean the dictionary
	for name in namelist[:2]:
		keffs[name]=ary(keffs[name],dtype=int)
	for name in namelist[2:]:
		keffs[name]=ary(keffs[name],dtype=float)
	PlotOnek_eff(keffs,"c/a/t")
	PlotOnek_eff(keffs,"coll")
	PlotOnek_eff(keffs,"abs")
	PlotOnek_eff(keffs,"track")
	plt.xlabel("total number of cycles")
	plt.ylabel(r"$k_{eff}$")
	plt.title("keff variation")
	plt.legend(title="keff evaulated by")
	plt.show()