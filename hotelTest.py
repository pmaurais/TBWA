#+JMJ+
#Paul A Maurais

import requests

#create http session
s=requests.session()

r=s.post('http://localhost:8080/hotels', params={'loc':'BOS', 'inDate':'2018-07-12', 'outDate':'2018-07-15'})

