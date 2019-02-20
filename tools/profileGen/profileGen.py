#!/usr/bin/python3
############################## profileGen.py ###################################
# Main script to run to generate profiles. Creates 3 CSVs:                     #
#   1. employer profiles                                                       #
#   2. employee profiles                                                       #
#   3. matchings between each employer-employee pair                           #
# and places them in output_csvs.                                              #
#                                                                              #
# Parses command line input to add a custom number of entries for each set of  #
# profiles.                                                                    #
################################################################################

# Project-defined modules
import constants;
import names;
import scoring;
# Builtin modules
import sys;
import optparse;
import csv;
import random;

# Returns a tuple of (options, args) parsed from the command line. All options
# and args are optional.
def getArgs():
    usage = "usage: %prog [-r] [-e]";
    parser = optparse.OptionParser(usage=usage)
    parser.add_option("-r", "--employer", action="store", type="int",
                    dest="numEmployers", default=1000,
                    help="number of employer entries to generate (default 1000)");
    parser.add_option("-e", "--employee", action="store", type="int",
                    dest="numEmployees", default=50,
                    help="number of employer entries to generate (default 50)");
    (options, args) = parser.parse_args();
    return (options, args);

def main():
    (options, args) = getArgs();

    # Generate list only once in runtime to make things faster
    maleNames = names.getFirstNames(names.MALE);
    femaleNames = names.getFirstNames(names.FEMALE);
    lastNames = names.getLastNames();

    employers = [];
    employees = [];
    usedIDs = set();                # To prevent duplicate IDs
    headers = constants.HEADERS;

    # Generate employer profiles
    with open(constants.OUTPUT_DIR + "employers.csv", "wb") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=headers);
        writer.writeheader();

        for i in range(0, options.numEmployers):
            userDict = {};

            firstName = names.getRandFirstName(maleNames, femaleNames);
            lastName = names.getRandLastName(lastNames);
            userDict["nameFirst"] = firstName;
            userDict["nameLast"] = lastName;
            newID = names.getIdFromName(firstName, lastName, usedIDs);
            userDict["id"] = newID;
            usedIDs.add(newID);
            userDict["origin"] = random.choice(constants.ORIGINS);

            for header in constants.HEADERS:
                if ("likert" in header) or ("semDiff" in header):
                    userDict[header] = random.randint(1,5);

            writer.writerow(userDict);
            employers.append(userDict);
        csvfile.close();

    # Generate employee profiles
    with open(constants.OUTPUT_DIR + "employees.csv", "wb") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=headers);
        writer.writeheader();

        for i in range(0, options.numEmployees):
            userDict = {};

            firstName = names.getRandFirstName(maleNames, femaleNames);
            lastName = names.getRandLastName(lastNames);
            userDict["nameFirst"] = firstName;
            userDict["nameLast"] = lastName;
            newID = names.getIdFromName(firstName, lastName, usedIDs);
            userDict["id"] = newID;
            usedIDs.add(newID);
            userDict["origin"] = random.choice(constants.ORIGINS);

            for header in constants.HEADERS:
                if ("likert" in header) or ("semDiff" in header):
                    userDict[header] = random.randint(1,5);

            writer.writerow(userDict);
            employees.append(userDict);
        csvfile.close();

    # Generate employer-employee pairings + reviews
    with open(constants.OUTPUT_DIR + "reviews.csv", "wb") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=constants.MATCHING_HEADERS);
        writer.writeheader();

        # Generate matchings
        for employer in employers:
            for employee in employees:
                pairDict = {};

                pairDict["employerID"] = employer["id"];
                pairDict["employeeID"] = employee["id"];
                pairDict["score"] = scoring.score(employer, employee);

                writer.writerow(pairDict);
        csvfile.close();

    return 0;

exitStatus = main();
exit(exitStatus);

