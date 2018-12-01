#!/usr/bin/env python3
# match.py

import pickle
import pandas as pd
from sklearn_pandas import DataFrameMapper

employeePath = 'data/employees.csv'

model = pickle.load(open('data/model.pickle', 'rb'))
employeeData = pd.read_csv(employeePath, sep=',')
employeeData['merge'] = 1

def match(employerPath):
    employerData = pd.read_csv(employerPath, sep=',')
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

    result = pd.DataFrame({
        'id_x': df['id_x'],
        'id_y': df['id_y']
    })
    result['score'] = model.predict(inputSamples)

    return result.sort_values(by=['id_x', 'score'], ascending=False)

