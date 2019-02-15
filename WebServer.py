# +JMJ+
# Paul A Maurais
# TernBooking LLC 2018

import cherrypy
import mysql.connector
import hashlib
import requests
import os, os.path
import random
from bs4 import BeautifulSoup, Tag
import card
import Sortand
import hCard
import filghtandhotel
import pickle



class WebApp(object):
    @cherrypy.expose
    def index(self):
        f=open('./html/index/index.html')
        html=f.read()
        f.close()
        return(html)

    def genFlights(self,data):
        f=open('./html/flights/index.html')
        html = f.read()
        f.close()
        html=html.replace("replace",data)
        soup = BeautifulSoup(html, 'html.parser')
        span = soup.find("span", id="username")
        uname = cherrypy.session['Username']
        span.string = uname
        return (soup.prettify())
        return html

    def genHotels(self,data):
        f=open('./html/hotel/index.html')
        html = f.read()
        f.close()
        html=html.replace("replace",data)
        soup = BeautifulSoup(html, 'html.parser')
        span = soup.find("span", id="username")
        uname = cherrypy.session['Username']
        span.string = uname
        return (soup.prettify())
        return html


    @cherrypy.expose
    def flights(self, src=-1, to=-1, departing=-1, returning=-1, flights_child=-1, flights_adult=-1):

        def getDur(dep,arr):
            return ""

        def getDayAndNum(dep):
            dep = dep.split('T')[0]
            return dep.split('-')[2]

        def getMonth(dep):
            dep = dep.split('T')[0]
            return dep.split('-')[1]

        def getRef(bool):
            if bool=='true':
                return('Refundable')
            else:
                return('Non Refundable')

        if src == '-1' or to == '-1' or departing == '-1' or flights_adult == '-1':
            return 'error'

        s = requests.session()

        if returning == '-1' or returning== "":
            departing=departing.split('.')
            departing=departing[2]+'-'+departing[1]+'-'+departing[0]

            r = s.get('https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search',
                      params={'apikey': '9KjwdxYduRHXjyaC7HuGbZ9FrwvjvWLY', 'origin': src, 'destination': to,
                               'departure_date': departing, 'adults':flights_adult})

            data=Sortand.run(r.text)
            html=""
            i=0
            cherrypy.session['Flights'] = data
            for itt in data:
                html=html+card.genFlightCard(airline=itt[0][-1],dtime=itt[2][0],departLoc=src,dur=getDur(itt[2][0],itt[3][-1]),dayAndNum=getDayAndNum(itt[2][0]),month=getMonth(itt[2][0]),atime=itt[3][-1],arrivalLoc=to,price=itt[4],ref=getRef(itt[5]),i=i)
                i=i+1

            return(self.genFlights(html))

        else:
            r=s.get('https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search',
                    params={'apikey': '9KjwdxYduRHXjyaC7HuGbZ9FrwvjvWLY', 'origin': src, 'destination': to,
                               'departure_date': departing, 'return_date':returning, 'adults':flights_adult})
            Sortand.run(r.text)

    @cherrypy.expose
    def hotels(self, hotel='-1', check_in='-1', check_out='-1', room='-1', hotel_adult=-1, hotel_child=-1,add_room=-1):


        if hotel == '-1' or check_in == '-1' or check_out == '-1':
            return 'error'

        check_in = check_in.split('.')
        check_in = check_in[2] + '-' + check_in[1] + '-' + check_in[0]
        check_out = check_out.split('.')
        check_out = check_out[2] + '-' + check_out[1] + '-' + check_out[0]

        s=requests.session()
        r = s.get('https://api.sandbox.amadeus.com/v1.2/hotels/search-airport',
                  params={'apikey': '9KjwdxYduRHXjyaC7HuGbZ9FrwvjvWLY', 'location': hotel, 'check_in': check_in,
                          'check_out': check_out})

        data=filghtandhotel.run(r.text)
        html=""
        i=0
        cherrypy.session['Hotels']=data
        for off in data:
            html=html+hCard.genHotelCard(i=i,title=off[0],phone=off[1],info=off[9],price=off[3])
            i=i+1

        return(self.genHotels(html))


    @cherrypy.expose
    def landing(self):

        if(cherrypy.session['Auth']==1):
            f=open('./html/landing/index.html')
            html = f.read()
            f.close()
            soup = BeautifulSoup(html, 'html.parser')
            span=soup.find("span", id="username")
            uname=cherrypy.session['Username']
            span.string=uname
            return(soup.prettify())

        raise cherrypy.HTTPRedirect('/index')


@cherrypy.expose
class hFav:

    @cherrypy.tools.accept(media='text/plain')
    @cherrypy.expose
    def POST(self,i):
        i=int(i)
        data=cherrypy.session['Hotels']
        UID=cherrypy.session['UID']

        id=data[i][6]+data[i][7]+data[i][8]
        data=pickle.dumps(data)

        # connect to user db
        cnx = mysql.connector.connect(user='pub', password='tbpublic',
                                      host='tbdb.c2iafgixqfc3.us-east-2.rds.amazonaws.com',
                                      database='tbdb', port='3306')

        # see if a fav already exists
        searchFav = "SELECT * FROM HF WHERE Hash =%s AND UID =%s;"
        cursor = cnx.cursor(buffered=True)
        cursor.execute(searchFav, (id,UID,))
        flag="0"

        if len(cursor._rows) == 0:
            addFav="INSERT INTO HF (HID,UID,IFlag,Hash) VALUES(%s,%s,%s,%s)"
            cursor.close()
            cursor = cnx.cursor(buffered=True)
            cursor.execute(addFav, (data,cherrypy.session['UID'],flag,id))
        else:
            remove="DELETE FROM HF WHERE id=%s AND UID=%s;"
            cursor.close()
            cursor = cnx.cursor(buffered=True)
            cursor.execute(remove, (id,cherrypy.session['UID']))

        cursor.close()
        cnx.close()

@cherrypy.expose
class SignUpAPI:
    # TODO: Implement NIST Guidelines
    # TODO generate user specific salt
    # TODO generate hash server side rather than client side

    @cherrypy.tools.accept(media='text/plain')
    @cherrypy.expose
    def POST(self, username, pwdHash, salt, FName, LName, Email, UID):
        # connect to user db
        cnx = mysql.connector.connect(user='pub', password='tbpublic',
                                      host='tbdb.c2iafgixqfc3.us-east-2.rds.amazonaws.com',
                                      database='tbdb', port='3306')

        # see if a user already exists
        searchEmail = "SELECT Email FROM users WHERE Email= %s;"
        cursor = cnx.cursor(buffered=True)
        cursor.execute(searchEmail, (Email,))

        if len(cursor._rows) > 0:
            raise cherrypy.HTTPRedirect('/index')
        else:
            # if no email is found, add the user to the database
            addUser = "INSERT INTO users VALUES(%s,%s,%s,%s,%s,%s,%s)"
            data = (username, pwdHash, salt, FName, LName, Email, UID)
            cursor = cnx.cursor()
            cursor.execute(addUser, data)
            raise cherrypy.HTTPRedirect('/signup?warning:1')

        cursor.close()
        cnx.close()

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
    def POST(self, Email="", passwd=""):
        pwdHash = hashlib.sha256(passwd.encode()).hexdigest()
        # connect to user db
        cnx = mysql.connector.connect(user='pub', password='tbpublic',
                                      host='tbdb.c2iafgixqfc3.us-east-2.rds.amazonaws.com',
                                      database='tbdb', port='3306')

        # check if email and pwd exist in db
        searchAuth = "SELECT * FROM udb WHERE Email= %s AND Pwd= %s ;"
        cursor = cnx.cursor(buffered=True)
        cursor.execute(searchAuth, (Email, pwdHash))

        if len(cursor._rows) == 0:
            cursor.close()
            raise cherrypy.HTTPRedirect('/index')
            return
        elif len(cursor._rows) > 0:
            cursor.close()
            # if user exists go to account page with UID
            searchAuth = "SELECT UID FROM udb WHERE Email= %s AND Pwd= %s "
            cursor = cnx.cursor(buffered=True)
            cursor.execute(searchAuth, (Email, pwdHash))

            for UID in cursor:
                # add session UID and auth indicator
                cherrypy.session['UID'] = str(UID[0])
                cherrypy.session['Auth'] = 1
                cherrypy.session['Username'] = Email
                cursor.close()
                cnx.close()
            raise cherrypy.HTTPRedirect('/landing')


if __name__ == '__main__':
    conf = {
        '/': {
            'tools.sessions.on': True,
            'tools.staticdir.root': os.path.abspath(os.getcwd())
        },
        "/html": {"tools.staticdir.on": True,
                 "tools.staticdir.dir": os.path.abspath("./html"), },
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
        '/HF': {
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
    webapp.HF = hFav()
    webapp.liAPI = LogInAPI()
    webapp.suAPI = SignUpAPI()
    #cherrypy.server.socket_host='0.0.0.0'
    cherrypy.quickstart(webapp, '/', conf)


    # +JMJ+
