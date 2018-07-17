
def genHotelCard(i,title,phone,info,price):
    card=""" 
        <li class="fav to-jump-link" >
            <img id=\""""+str(i)+"""\" onclick="heartChange(this)" src="/html/common/images/icon_heart_gray.png" />
        </li>
        <li class="to-jump-link" >
            <img src="html/hotel/images/hotel_01.png" />
            <div class="info-container">
                <div class="info-title">"""+title+"""</div>
                <div class="info-stars">
                    <b>"""+phone+"""</b>
                </div>
                <div class="info-content">
                    """+info+"""
                </div>
            </div>
            <div class="booked">
                <b>"""+price+"""</b>
                <p>total price</p>
            </div>
        </li>
        <li class="split"></li>

            """
    return card