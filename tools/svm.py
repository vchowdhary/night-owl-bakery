#!/usr/bin/env python3
# svm.py

import pickle
import numpy as np
import pandas as pd
from sklearn.svm import SVR
from sklearn.metrics import r2_score
from sklearn_pandas import DataFrameMapper

# Data file paths
employerPath = 'data/employers.csv'
employeePath = 'data/employees.csv'
reviewPath = 'data/reviews.csv'

# Data file parsing
employerData = pd.read_csv(employerPath, sep=',', index_col='id')
employeeData = pd.read_csv(employeePath, sep=',', index_col='id')
reviewData = pd.read_csv(reviewPath, sep=',')

df = reviewData
df = df.join(employerData, how='inner', on='employerID')
df = df.join(employeeData, how='inner', on='employeeID', rsuffix='_e')

# Feature selection
attrs = set(df.columns.values)
ignoredAttrs = set([
    'employerID',
    'employeeID',
    'nameFirst',
    'nameFirst_e',
    'nameLast',
    'nameLast_e',
    'origin',
    'origin_e'
])
outputAttr = 'score'
inputAttrs = list(attrs - ignoredAttrs - set([outputAttr]))
inputsMap = DataFrameMapper([
    (inputAttrs, None)
])

# Model training
inputSamples = inputsMap.fit_transform(df)
outputSamples = list(df[outputAttr].values)

model = SVR(kernel='rbf', gamma='scale')
model.fit(inputSamples, outputSamples)

predOutputs = model.predict(inputSamples)
print('r2 score: %.6f' % (r2_score(outputSamples, predOutputs)))

pickle.dump(model, open('data/model.pickle', 'wb'))

