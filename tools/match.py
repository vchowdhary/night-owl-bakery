#!/usr/bin/env python3
# match.py

import sys
import pickle
import pandas as pd
from sklearn_pandas import DataFrameMapper

employeePath = 'data/employees.csv'

model = pickle.load(open('data/model.pickle', 'rb'))
employeeData = pd.read_csv(employeePath, sep=',')
employeeData['merge'] = 1

employerDataReader = pd.read_csv(sys.stdin, sep=',', chunksize=1)

for employerData in employerDataReader:
    employerData['merge'] = 1
    df = pd.merge(employerData, employeeData, on='merge')
    del df['merge']

    attrs = set(df.columns.values)
    ignoredAttrs = set([
        'id_x',
        'id_y',
        'nameFirst_x',
        'nameFirst_y',
        'nameLast_x',
        'nameLast_y',
        'origin_x',
        'origin_y'
    ])

    inputAttrs = list(attrs - ignoredAttrs)
    inputsMap = DataFrameMapper([
        (inputAttrs, None)
    ])

    inputSamples = inputsMap.fit_transform(df)

    result = pd.DataFrame(data={
        'id_y': df['id_y'],
        'score': model.predict(inputSamples)
    });

    result.sort_values(by=['score'], ascending=False, inplace=True);
    result = result.head(5);

    sys.stdout.write(df['id_x'][0] + '\n')
    result.to_csv(sys.stdout, sep=',', header=False, index=False)

