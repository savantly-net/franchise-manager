#!/bin/bash

if [ "true" = "${START_POSTGRES}}" ]; then
    # start postgres
    su - postgres -c "/usr/lib/postgresql/12/bin/initdb -D $PGDATA"
    su - postgres -c "PGDATA=$PGDATA /usr/lib/postgresql/12/bin/pg_ctl -D /db -l logfile start"
fi

# start nginx in background
nginx

# copy the modules into the classpath
cp /sprout/modules/* /sprout/BOOT-INF/lib/

# start the sprout server
java ${JAVA_OPTS} -cp ${SPROUT_OTHER_CLASSES}:/sprout -Dserver.port=${SERVER_PORT} org.springframework.boot.loader.JarLauncher