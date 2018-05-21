import numpy as np
import pandas as pd
import re

inPutFile = open('ToParse1.txt')    # I read a txt as an input directly, you could define your own input


def sort_input(inpt):   # This function sort out all desired information and store them inside of a pandas data frame

    # Lists
    departure = []
    arrival = []
    price = []
    refund = []
    airline = []

    # Counters
    outboundflag = 0
    flightct = -1

    for line in inpt:

        # Total Price Sorting Logic
        if 'total_price' in line:   # we sort out total price information at this modle
            price.append(re.search(r'\d+\.\d+', line).group(0))
            # print('o', outboundflag)
            # print('price', len(price))

            if outboundflag > len(price):   # make sure these information lines up with outbound number
                diff_price = outboundflag - len(price)
                i = 0
                while i < diff_price:
                    # print('i', i)
                    # print('diff', diff)
                    price.append(price[-1])
                    i += 1

                # print('->o', outboundflag)
                # print('-> price', len(price))

        # Refundable Sorting Logic
        if 'refundable' in line:
            refund.append(line[-7:-1])
            if outboundflag > len(refund):
                diff_refund = outboundflag - len(refund)
                j = 0
                while j < diff_refund:
                    # print('j', j)
                    # print('diff', diff2)
                    refund.append(refund[-1])
                    j += 1

        # Outbound counting Logic
        if 'outbound' in line:
            outboundflag += 1

        # Airline IATA Sorting Logic
        if 'marketing_airline' in line:
            airline.append(line[-5:-3])

        # Airline Flight number Sorting Logic
        if 'flight_number' in line:
            airline.append(re.search(r'\d+', line).group(0))
            flightct += 1
            # Airline Information Reconstruction Logic
            if (len(airline) % (2 + flightct) == 0) & (len(airline) >= 2):
                new1 = airline[-1]
                new2 = airline[-2]
                airline.append((airline[-2] + airline[-1]))
                airline.remove(new1)
                airline.remove(new2)
                # print('hello', len(airline))
                # print('out_flag', outboundflag)

                # if outboundflag < len(airline2):
                #     # print(type(airline2[outboundflag-1:]))
                #     temp = ' '.join(airline2[outboundflag-1:]).split()
                #     # print('temp', temp)

        if 'departs_at' in line:
            departure.append(re.search(r'\d+\-\d+\-\d+' + 'T' + r'\d+\:\d+', line).group(0))

            lendep = len(departure)
            diff_depart = lendep - outboundflag
            k = 0
            print('len out loop', lendep)
            print('o', outboundflag)
            while k < diff_depart:
                print('diff len', diff_depart)
                try:
                     temp = ' '.join(departure[(outboundflag - 1):]).split()
                except:
                    pass
                print('temp', temp)
                #
                # departure.append(temp)
                #
                for item in temp:
                    if item in departure:
                        departure.remove(item)
                k += 1
                print('k', k)

        if 'arrives_at' in line:
            arrival.append(re.search(r'\d+\-\d+\-\d+' + 'T' + r'\d+\:\d+', line).group(0))

    # print('iti_flag', itineraryflag)
    # print('out_flag', outboundflag)
    # print(airline)
    # print(len(airline))
    print('departure len', len(departure))
    print('departure time', departure)
    # print('IATA', len(IATA))
    # print(IATA)
    # print('flight_number', len(flightnumber))
    # print(flightnumber)
    # print('price', len(price))
    # print('price', price)
    # print('refund', len(refund))
    # print('departure', len(departureT))
    # print('arrT', len(arrivalT))


sort_input(inPutFile)
