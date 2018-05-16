#+JMJ+
#Paul A Maurais

import mysql.connector
import hashlib

cnx = mysql.connector.connect(user='pub', password='tgpub',
                                      host='userdb.c55rreeazscw.us-east-1.rds.amazonaws.com',
                                      database='tgudb', port='4044')

#see if a user already exists
search="SELECT * FROM users WHERE username= %s and P_Hash= %s"
cursor=cnx.cursor(buffered=True)
pwd='temppw'
pwd=hashlib.sha256(pwd.encode()).hexdigest()

cursor.execute(search,("pmaurais@ternaway.com",pwd))

if len(cursor._rows)>0:
    print('FOUND')

print(cursor)

#+JMJ+