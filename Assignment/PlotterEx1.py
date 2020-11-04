#!/home/ocean/anaconda3/bin/python3
from numpy import cos, arccos, sin, arctan, tan, pi, sqrt; from numpy import array as ary; import numpy as np; tau = 2*pi
from matplotlib import pyplot as plt
from MCNPPlotter import ReadBlockOfText, ConvToDict

fname="Ex1_2800000.out"
FOM=True

def ReadSurfTall(NameOfTally):
	#read from file
	TallyStats=ReadBlockOfText(fname,
	trigger1="1tally fluc",
	length=12,
	ScrollMore=1,
	)

	#Separate the name of the first row from the body
	tallynames=TallyStats[0][1::2] #Get the names of the tallies in the first row
	TallyStats=TallyStats[1:]#Cut out the first row

	#Separate the first row from the rest.
	namelist=TallyStats[0][1:]#ignore the first element "nps"
	TallyStats=ary(TallyStats[1:]).T #reshape it by transposing it.

	#create a namelist without duplicates
	cutlist=[]
	[cutlist.append(s) for s in namelist if s not in cutlist] #Implicit for loop without an explicit output

	#separate x values (nps) from the y-values (everything else.)
	nps,TallyStats=[ary(TallyStats[0],dtype=int),ary(TallyStats[1:],dtype=float)]#cut out the first row
	NumTallies=len(namelist)/len(cutlist)#Check how many times does namelist repeat itself
	assert int(NumTallies)==NumTallies, "I suck at programming because there are more columns outputted by this tally table than I expected"
	TallyStats= np.reshape(TallyStats,[int(NumTallies),-1,np.shape(TallyStats)[1]])#reshaping it, while preserving the last dimension

	#Dictionary
	ListOfTallyDict=[]
	for tal in TallyStats:
		ListOfTallyDict.append(ConvToDict(tal,cutlist))
	for i in range(len(ListOfTallyDict)):
		ListOfTallyDict[i]["nps"]=nps
		ListOfTallyDict[i]["tally"]=tallynames[i]
	for D in ListOfTallyDict:
		if D["tally"]==NameOfTally:
			return D
def PlotTally(ax,tal):
	x = tal["nps"]
	mean=tal["mean"]
	sd=tal["mean"]*tal["error"]
	if FOM:
		ax.plot(x,tal["fom"],label="tally "+tal["tally"])
	else:
		ax.plot(x,mean,label="mean (tally "+tal["tally"]+")")
		#plot confidence interval as well
		ax.fill_between(x,mean-sd,mean+sd,label=r"$1 \sigma$ confidence",alpha=0.3)
	ax.legend()
	return

if __name__=="__main__":
	[fig, [ax1,ax2,ax3]] = plt.subplots(nrows=3,sharex=True)
	tally1=ReadSurfTall("12")
	PlotTally(ax1,tally1)
	tally2=ReadSurfTall("22")
	PlotTally(ax2,tally2)
	tally3=ReadSurfTall("32")
	PlotTally(ax3,tally3)
	plt.xlabel("nps")
	if FOM:
		ax2.set_ylabel("Figure of Merit,\n(histories/minute)*(f(x) signal-to-noise ratio)**2")
		ax1.set_title("Figure of Merit variation")
	else:
		ax2.set_ylabel(r"particle flux per history (#/$cm^2$)")
		ax1.set_title("mean flux variation with number of histories")
	plt.show()