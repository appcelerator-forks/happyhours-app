migration.up = function(migrator) {
    migrator.db.execute('ALTER TABLE ' + migrator.table + ' ADD COLUMN image Text;');
};

migration.down = function(migrator) {
    var db = migrator.db;
    var table = migrator.table;
    db.execute('CREATE TEMPORARY TABLE etablishment_backup(id,name,adress,gps,yelp_id,city,haveHappy,now, description_2);');
    db.execute('INSERT INTO etablishment_backup SELECT id,name,adress,gps,yelp_id,city,haveHappy,now, description_2 FROM ' + table + ';');
    migrator.dropTable();
    migrator.createTable({
        columns: {
            "id"			:  "INTEGER PRIMARY KEY",
			"name"			:  "Text",
			"adress"		:  "Text",
			"gps"			:  "Text",
			"yelp_id"		:  "Text",
			"city"			:  "Text",
			"haveHappy"		:  "Text",
			"now"			:  "Text",
            "description_2" : "Text"
        },
    });
    db.execute('INSERT INTO ' + table + ' SELECT id,name,adress,gps,yelp_id,city,haveHappy,now, description_2 FROM etablishment_backup;');
    db.execute('DROP TABLE etablishment_backup;');
};
