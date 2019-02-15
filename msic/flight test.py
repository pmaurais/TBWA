#+JMJ+
#Paul A Maurais

import requests

#create http session
s=requests.session()

r=s.post('http://localhost:8080/flights', params={'src':'BOS', 'to':'BWI', 'departing':'17.07.2018', 'returning':'-1', 'flights_child':'-1', 'flights_adult':'1'})

#+JMJ+