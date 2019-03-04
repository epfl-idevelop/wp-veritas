FROM jshimko/meteor-launchpad:latest
RUN chmod -R 777 /opt/meteor/dist/bundle
ENTRYPOINT ["sh", "./entrypoint.sh"]
