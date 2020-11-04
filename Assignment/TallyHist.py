#!/home/ocean/anaconda3/bin/python3
from numpy import cos, arccos, sin, arctan, tan, pi, sqrt; from numpy import array as ary; import numpy as np; tau = 2*pi
from matplotlib import pyplot as plt
from MCNPPlotter import ReadBlockOfText, ConvToDict

fname="Ex1_2800000.out"
Normalized=True
LogScale=True

def ReadSurfTall(detnum):
	#read from file
	Tally=ReadBlockOfText(fname,
	trigger1="1tally  "+detnum,
	trigger2=" surface ",
	length=30+1,#30 bins
	)
	#Convert to dictionary
	namelist=["UpperBinE","flux","Rel_err"]
	Tally_dict=ConvToDict(ary(Tally,dtype=float).T,namelist)
	#Get the class marks etc.
	UpperBinE=Tally_dict["UpperBinE"]
	ClassBoundaries=np.concatenate([[0],UpperBinE])
	ClassWidth=np.diff(ClassBoundaries)
	Tally_dict["ClassWidth"]= ClassWidth
	Tally_dict["linClassMark"] = UpperBinE - ClassWidth/2
	logClassUpperBound=np.log10(UpperBinE)
	logClassMark = logClassUpperBound - np.diff(logClassUpperBound)[0]/2
	Tally_dict["logClassMark"] = logClassMark
	return Tally_dict

if __name__=="__main__":
	maxwidth=1/3-.1
	for i in range(3):
		detnum=["32","12","22"][i]
		tally=ReadSurfTall(detnum)
		if Normalized:
			plt.bar(tally['logClassMark']-maxwidth/3*i,tally['flux']/sum(tally['flux']),label="tally "+detnum,alpha=0.5,width=maxwidth/3,linewidth=1,edgecolor="black")
		else:
			plt.bar(tally['logClassMark']-maxwidth/3*i,tally['flux'],label="tally "+detnum,alpha=0.5,width=maxwidth/3,linewidth=1,edgecolor="black")
	plt.legend()
	plt.xlabel(r"$log_{10}$(E/MeV)")
	if Normalized:
		plt.ylabel("normalized probability")
	else:
		plt.ylabel("probability per history")
	if LogScale:
		plt.yscale("log")
	plt.suptitle("Spectra of the neutron energy distribution")
	plt.title("showing the probability of the passing particle falling into each bin")
	plt.show()