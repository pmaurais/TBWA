#+JMJ+
#Paul A Maurais

import requests

#create http session
s=requests.session()

r=s.post('http://localhost:8080/hotels', params={'loc':'BOS', 'inDate':'09.08.2018', 'outDate':'12.08.2018'})
r=s.post('http://localhost:8080/HF', params={'id':'1'})
print(r.text)

