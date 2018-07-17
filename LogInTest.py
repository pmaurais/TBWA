#+JMJ+
#Paul A Maurais

import requests

#create http session
s=requests.session()

r=s.post('http://localhost:8080/liAPI', params={'email':'arohlfing@ternbooking.com', 'passwd':'password'})

print(r.text)