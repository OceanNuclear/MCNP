#!/home/ocean/anaconda3/bin/python3
from numpy import cos, arccos, sin, arctan, tan, pi, sqrt; from numpy import array as ary; import numpy as np; tau = 2*pi
from matplotlib import pyplot as plt

fname="/home/ocean/Documents/GitHubDir/MCNP/Assignment/Ex3_e25_0.15B.err"
f=open(fname,"r")
data=f.readlines()
f.close()
data=[float(line) for line in data]
plt.plot(data)
plt.show()