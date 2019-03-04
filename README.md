# How to run wp-veritas application

`meteor --settings settings.json`

and go to http://localhost:3000/

# How to load data

In the folder private/ you can find a file 'source-veritas.csv'.
To load this file you must: 
1. Open a meteor shell : `meteor shell`
2. Run the method `importVeritas()`

If you want delete all sites before load data you must :
1. Open a mongo shell `mongo --host localhost:3001`
2. You must select the DB: meteor:PRIMARY> use meteor
switched to db meteor
3. You can now delete all sites: meteor:PRIMARY> db.sites.deleteMany({})
{ "acknowledged" : true, "deletedCount" : 676 }

# Docker

`docker build -t wp-veritas/app .`

`docker-compose up -d`

then go to http://localhost

Source : https://hub.docker.com/r/jshimko/meteor-launchpad/
