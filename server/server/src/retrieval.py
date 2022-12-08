# -*- coding: utf-8 -*-

from math import log

'''
Using the following formula to calculate BM25
((k3 + 1)q)/((k3 + q)) * ((k1 + 1)f)/((K + f)) * log((r + 0.5)(N − n − R + r + 0.5))/((n − r + 0.5)(R − r + 0.5))
REFERENCE: https://xapian.org/docs/bm25.html
'''

# DEFINING CONSTANTS

k1 = 1.2
b = 0.75
k2 = 100
R = 0 #Since no relevance info is available

# MAIN METHOD
# n = Length of inverted index of that token
# N = no of documents
# f = no of times that term appears in that document
# q = 1
# r = 0

def BM25(docLen, avDocLen, n, N, f, q, r):
    p1 = ((k2 + 1) * q) / (k2 + q) # =1 as q = 1
    p2 = ((k1 + 1) * f) / (getK(docLen, avDocLen) + f)
    p3 = log((r + 0.5) * (N - n - R + r + 0.5)) / ((n - r + 0.5) * (R - r + 0.5))
    return p1 * p2 * p3

def getK(docLen, avDocLen):
    return k1 * ((1 - b) + b * (float(docLen) / float(avDocLen)))