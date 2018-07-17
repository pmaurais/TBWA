
def genFlightCard(airline,dtime,departLoc,dur,dayAndNum,month,atime,arrivalLoc,price,ref,i):
    card="""<tr class="fav to-jump-link">
        <td >
            <img id=\""""+str(i)+"""\" onclick="heartChange(this)" src="/html/common/images/icon_heart_gray.png" />
        </td>
    </tr>
    <tr class="to-jump-link">
        <td class="airline">
            <img src=\"""" + getAirlineImage(airline) + """\">
            <span>""" + getAirline(airline) + """</span>
        </td>
        <td class="departure">
            <p>""" + dtime + """</p>
            <p>""" + departLoc + """</p>
        </td>
        <td class="duration">
            <p>""" + dur + """</p>
            <img src="/html/common/images/long-arrow-right.png" />
            <p>""" + dayAndNum + """<i></i> """ + month + """</p>
        </td>
        <td class="arrival">
             <p>""" + atime + """</p>
            <p>""" + arrivalLoc + """</p>
        </td>
        <td class="price">
            <div>""" + str(price) + """</div><span>""" + ref + """</span>
        </td>
    </tr>
    <!-- each item end -->"""

    return card

def getAirlineImage(airline):
    a=''
    if airline=='B6':
        a = '\html\common\images\jetblue-logo.png'
    if airline=='NK':
        a = '\html\common\images\spirit.png'
    if airline=='AA':
        a = '\html\common\images\\flights_01.png'
    if airline=='DL':
        a = '\html\common\images\\flights_04.png'
    if airline=='UA':
        a = '\html\common\images\\UAx.png'
    return(a)

def getAirline(airline):
    a = ''
    if airline == 'B6':
        a = 'JetBlue'
    if airline=='NK':
        a = 'Spirit'
    if airline=='AA':
        a = 'American'
    if airline=='DL':
        a = 'Delta'
    if airline=='UA':
        a = 'United'
    return (a)


