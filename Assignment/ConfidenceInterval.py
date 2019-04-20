#!/home/ocean/anaconda3/bin/python3
from numpy import cos, arccos, sin, arctan, tan, pi, sqrt; from numpy import array as ary; import numpy as np; tau = 2*pi
from matplotlib import pyplot as plt
#read the .txt file
fname="KeffvsB.txt"
f=open(fname,"r")
data=f.readlines()
f.close()

B,keff,sl1,su1,sl2,su2,sl3,su3=[],[],[],[],[],[],[],[]
for line in data[2:]:
	v0,v1,v2,v3,v4,v5,v6,v7=ary(line.split("\t"),float)#split the line by tab
	B.append(v0)
	keff.append(v1)
	sl1.append(v2)
	su1.append(v3)
	sl2.append(v4)
	su2.append(v5)
	sl3.append(v6)
	su3.append(v7)
plt.plot(B,keff,marker="x")
plt.fill_between(B,sl1,su1,label=r"$1 \sigma$ (68%)",alpha=0.4)
plt.fill_between(B,sl2,su2,label=r"$2 \sigma$ (95%)",alpha=0.4)
plt.fill_between(B,sl3,su3,label=r"$3 \sigma$ (99%)",alpha=0.4)
plt.plot(B,np.ones(np.shape(B))*0.8,color="black",label=r"$k_{eff}=0.8$ limit")
plt.legend(title="confidence intervals")
plt.xlabel("Boron concentration (ppm)")
plt.ylabel(r"$k_{eff}$ value")
plt.show()