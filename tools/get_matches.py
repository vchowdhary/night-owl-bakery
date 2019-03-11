#!/usr/bin/env python3
# match.py

import sys
import json
import pickle
import pandas as pd
from sklearn_pandas import DataFrameMapper
from dbmanager import Database

def setup():
    db = Database()
    db.createMatchTable()
    employeePath = '../data/employees.csv'
    employerPath = '../data/employers.csv'

    model = pickle.load(open('/data/model.pickle', 'rb'))
    employeeData = pd.read_csv(employeePath, sep=',')
    employeeData['merge'] = 1

    employerDataReader = pd.read_csv(employerPath, sep=',', chunksize=1)

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
        #print(df)

        result = pd.DataFrame(data={
            'id_x': df['id_x'],
            'id_y': df['id_y'],
            'score': model.predict(inputSamples)
        });
        
        id = 0

        result.sort_values(by=['score'], ascending=False, inplace=True);
        result = result.head(5)

        for index, row in result.iterrows():
            id += 1
            print(row)
            print(row[0])
            print(row[1])
            print(row[2])
            db.insertMatchTable(id, row[0], row[1], row[2])

def get_matches(employer, employees):
    model = pickle.load(open('data/model.pickle', 'rb'))
    employerdf = pd.DataFrame.from_dict(pd.io.json.json_normalize(employer, sep='_'))
    employeedf = pd.DataFrame.from_records(pd.io.json.json_normalize(employees, sep='_'))
    del employerdf['origin']
    del employerdf['bio']
    del employerdf['isEmployee']
    del employerdf['phone']
    del employerdf['zipCode']
    del employerdf['nameFirst']
    del employerdf['nameLast']

    #print(employeedf)
    employerdf['merge'] = 1
    employeedf['merge'] = 1
    df = pd.merge(employerdf, employeedf, how="inner", on="merge")
    del df['merge']
    #print(employerdf)
   # print(df['id_y'])
   # print(df)
    
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
   # print(inputSamples)  

    result = pd.DataFrame(data={
        'id_x': df['id_x'],
        'id_y': df['id_y'],
        'score': model.predict(inputSamples)
    });

    result.sort_values(by=['score'], ascending=False, inplace=True);
    result = result.head(5)

    print(result.to_json())
  

    sys.stdout.flush()

def read_in():
    lines = sys.stdin.readlines()
    #Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])

if __name__ == "__main__":
    lines = read_in()
    get_matches(lines[0], lines[1])
    sys.stdout.flush()
    
