if (Ti.Platform.name === 'iPhone OS'){
  style = Ti.UI.iPhone.ActivityIndicatorStyle.DARK;
}
else {
  style = Ti.UI.ActivityIndicatorStyle.DARK;
}

Alloy.Collections.etablishment.fetch();


function haveHappyFilter(collection) {
	Ti.API.info("on est dans la fonction haveHappyFilter");

	date = new Date();
	h = date.getHours()-6;
	m = date.getMinutes();

    return collection.where({
        haveHappy : "true"
    });
}

function transform(model) {
	Ti.API.info("on est dans la fonction transform");

	date = new Date();
	h = date.getHours()-6;
	m = date.getMinutes();

	if(h <0)
		h = h + 24;

	var hourLast= 100;
	var minuteLast= 100;
	var hourEndLast= -1;
	var minuteEndLast= -1;

	var now ="";

	var happyhour = Alloy.createCollection('happyhour');

	var db = Ti.Database.open('happyhourdb');

	var transform = model.toJSON();
		
	if (happyhour.count() && transform.id) {


		
		var happyhourData = db.execute("SELECT * FROM happyhour WHERE id_etablishment = " +  transform.id);
		

		while (happyhourData.isValidRow()){
		

			////////Complicated operation on hour !!!///////
			var hour = happyhourData.fieldByName('hours');

			var pos = hour.indexOf('/');

			var begin = hour.substr(0, pos);
			var end = hour.substr(pos+1, hour.length);
		
			var heure = begin.substr(0, 2);

			var minute = 0;
			
			if (heure < 6) {
				heure = heure + 18;
			}
			
			heure = heure - 6;
		
			if (begin.length == 3) {
			 	minute = 0;
			} else {
				minute = begin.substr(3, 2);
			}
		
			var posH = end.lastIndexOf('H');
			var heureEnd = end.substr(0, posH);
			var minuteEnd = 0;

			if (heureEnd < 6) {
				heureEnd =+ 18;
			}

			heureEnd = heureEnd - 6;

			if (end.length == 3) {
			 	minuteEnd = 0;
			} else {
				minuteEnd = end.substr(3, 2);
			}
	
			if (hourLast>heure) {
				hourLast=heure;
			}

			if (minuteLast>minute){
				minuteLast=minute;
			}

			if (hourEndLast<heureEnd){
				hourEndLast=heureEnd;
			}

			if (minuteEndLast<minuteEnd){
				minuteEndLast=minuteEnd;
			}

			happyhourData.next();
		}


		if (((hourLast == h &&  minuteLast <= m ) || (hourLast < h)) && ((hourEndLast > h  )||(hourEndLast == h && minuteEndLast >= m))) {
			now = "En ce moment";
		} else if((hourLast == h &&  (minuteLast - m)  <= 30 && (minuteLast - m) > 0)) {
			now = "Dans 30 min";
		} else if (hourLast == (h + 1) &&  (((m - minuteLast)  < 60) && ((m - minuteLast)  >= 30))){
			now = "Dans 30 min";
		} else if (hourLast == (h + 1) &&  (((m - minuteLast)  >= 0) && ((m - minuteLast)  <= 30))){
			now = "Dans 1h";
		} else if (hourLast>h){
			now = " ";
		} else {
			now = " ";
		}

		var etablishment = Alloy.createCollection('etablishment');

		var db2 = Ti.Database.open('etablishmentdb');
		var sql = '';
		
		if(now == " "){
			if(transform.haveHappy != 'false'){
				sql = "UPDATE etablishment SET haveHappy='false' WHERE id=" + transform.id;
				db2.execute(sql);
			}	

		}else {
			if(transform.haveHappy != 'true'){
				sql = "UPDATE etablishment SET haveHappy='true' WHERE id=" + transform.id;
				db2.execute(sql);
			}
		}
		transform.now = now;

		happyhourData.close();
		db.close();
		db2.close();

	} else {

	}
	return transform;
}

function myRefresher(e) {
   Alloy.Collections.etablishment.fetch();
   Ti.API.info("on refresh");
	e.hide();
}

function goEtablishment() {

	Ti.API.info("on ouvre la fenetre etablishment");

	var etablishmentView = Alloy.createController('etablishment', {
		'etablishmentId'	: this.idEtablishment,
		'etablishmentTitle'	: this.titleEtablishment
	});
}