# +JMJ+
# Paul A Maurais
# TernBooking LLC 2018

import cherrypy
import mysql.connector
import hashlib
import requests
import os, os.path
import random


class WebApp(object):
    @cherrypy.expose
    def index(self):
        # The landing page would be served here
        pass

    @cherrypy.expose
    def flights(self, src=-1, dest=-1, dDate=-1, rDate=-1, numAdult=-1):

        if src == '-1' or dest == '-1' or dDate == '-1' or numAdult == '-1':
            return 'error'

        s = requests.session()

        if rDate =='-1':
            r = s.get('https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search',
                       params={'apikey': '6muJDEG6uJCN9Un0FCLC9s1xDtyHzmGM', 'origin': src, 'destination': dest,
                               'departure_date': dDate,'adults':numAdult})
            print(r.text)
        else:
            r=s.get('https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search',
                       params={'apikey': '6muJDEG6uJCN9Un0FCLC9s1xDtyHzmGM', 'origin': src, 'destination': dest,
                               'departure_date': dDate,'return_date':rDate,'adults':numAdult})
            print(r.text)

    @cherrypy.expose
    def hotels(self, loc='-1', inDate='-1', outDate='-1', rooms='-1', guests=-1):
        if loc == '-1' or inDate == '-1' or outDate == '-1':
            return 'error'

        s=requests.session()
        r = s.get('https://api.sandbox.amadeus.com/v1.2/hotels/search-airport',
                  params={'apikey': '6muJDEG6uJCN9Un0FCLC9s1xDtyHzmGM', 'location': loc, 'check_in': inDate,
                          'check_out': outDate})

        print(r.text)


    @cherrypy.expose
    def cruises(self, port=-1, dest=-1, line=-1, month=-1):
        # the cruises page would be served here
        pass

    @cherrypy.expose
    def login(self, warning=0):
        # the login page would be served here
        return "LogIn"

    @cherrypy.expose
    def signup(self, warning=0):
        # the signup page would be served here
        pass

    @cherrypy.expose
    def account(self, UID=0):
        # the account page would be served here
        return "Account"

    @cherrypy.expose
    def settings(self):
        # the account settings page would be served here
        pass

    @cherrypy.expose
    def trips(self):
        # the trips page would be served here
        pass

    @cherrypy.expose
    def payment(self):
        # the payment page would be served here
        pass

    @cherrypy.expose
    def booked(self):
        # the booking success page would be served here
        pass


@cherrypy.expose
class SignUpAPI:
    # TODO: Implement NIST Guidelines
    # TODO generate user specific salt
    # TODO generate hash server side rather than client side

    @cherrypy.tools.accept(media='text/plain')
    @cherrypy.expose
    def POST(self, username, pwdHash, salt, FName, LName, Email, UID):
        # connect to user db
        cnx = mysql.connector.connect(user='pub', password='tgpub',
                                      host='userdb.c55rreeazscw.us-east-1.rds.amazonaws.com',
                                      database='tgudb', port='4044')

        # see if a user already exists
        searchEmail = "SELECT Email FROM users WHERE Email= %s"
        cursor = cnx.cursor(buffered=True)
        cursor.execute(searchEmail, (Email,))

        if len(cursor._rows) > 0:
            raise cherrypy.HTTPRedirect('/signup?warning:-1')
        else:
            # if no email is found, add the user to the database
            addUser = "INSERT INTO users VALUES(%s,%s,%s,%s,%s,%s,%s)"
            data = (username, pwdHash, salt, FName, LName, Email, UID)
            cursor = cnx.cursor()
            cursor.execute(addUser, data)
            raise cherrypy.HTTPRedirect('/signup?warning:1')

        cursor.close()
        cnx.close()

    @cherrypy.expose
    def salt_generate(self):  # This will generage a 16-character base-62 salt
        alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
        salt = []
        for i in range(16):
            salt.append(random.choice(alphabet))

            return "".join(salt)


@cherrypy.expose
class LogInAPI:
    # TODO: Add Salt functionality
    # TODO: Implement Bycrypt

    @cherrypy.tools.accept(media='text/plain')
    @cherrypy.expose
    def POST(self, email="", passwd=""):
        pwdHash = hashlib.sha256(passwd.encode()).hexdigest()
        # connect to user db
        cnx = mysql.connector.connect(user='pub', password='tgpub',
                                      host='userdb.c55rreeazscw.us-east-1.rds.amazonaws.com',
                                      database='tgudb', port='4044')

        # check if email and pwd exist in db
        searchAuth = "SELECT * FROM users WHERE Email= %s AND P_Hash= %s "
        cursor = cnx.cursor(buffered=True)
        cursor.execute(searchAuth, (email, pwdHash))

        if len(cursor._rows) == 0:
            cursor.close()
            raise cherrypy.HTTPRedirect('/login?warning=-1')
        elif len(cursor._rows) > 0:
            cursor.close()
            # if user exists go to account page with UID
            searchAuth = "SELECT UID FROM users WHERE Email= %s AND P_Hash= %s "
            cursor = cnx.cursor(buffered=True)
            cursor.execute(searchAuth, (email, pwdHash))

            for UID in cursor:
                # add session UID and auth indicator
                cherrypy.session['UID'] = str(UID[0])
                cherrypy.session['Auth'] = 1
                cursor.close()
                cnx.close()
                rdString = '/account?UID=' + str(UID[0])
                raise cherrypy.HTTPRedirect(rdString)


if __name__ == '__main__':
    conf = {
        '/': {
            'tools.sessions.on': True,
            'tools.staticdir.root': os.path.abspath(os.getcwd())
        },
        '/suAPI': {
            'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
            'tools.response_headers.on': True,
            'tools.response_headers.headers': [('Content-Type', 'text/plain')],
        },
        '/liAPI': {
            'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
            'tools.response_headers.on': True,
            'tools.response_headers.headers': [('Content-Type', 'text/plain')],
        },
        '/static': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': './public'
        }
    }
    webapp = WebApp()
    webapp.liAPI = LogInAPI()
    webapp.suAPI = SignUpAPI()
    cherrypy.quickstart(webapp, '/', conf)


    # +JMJ+
