#+JMJ+
#Paul A Maurais

import requests

#create http session
s=requests.session()

r=s.post('http://localhost:8080/flights', params={'src':'BOS', 'dest':'BWI', 'dDate':'2018-07-15', 'rDate':'-1', 'numAdult':'1'})

#+JMJ+